import { readFile } from "node:fs/promises";
import { CacheKeys, CacheService } from "../cache/CacheService.ts";
import { Database } from "./Database.ts";
import { lessonProgress, lessons, modules, problemAttempts, problems, tracks } from "./schema.ts";
import type { SeedModule, SeedTrack } from "./seed/types.ts";

const sources: { file: string; name: string }[] = [
  { file: "./seed/dsa.ts", name: "dsa" },
  { file: "./seed/systemDesign.ts", name: "systemDesign" },
  { file: "./seed/interviewReadiness.ts", name: "interviewReadiness" },
];

class Loader {
  async load(): Promise<SeedTrack[]> {
    const videos = await this.videos();
    const out: SeedTrack[] = [];
    for (const s of sources) {
      try {
        const mod = (await import(s.file)) as Record<string, SeedTrack>;
        if (mod[s.name]) out.push(this.attachVideos(await this.mergeModules(mod[s.name], s.name), videos));
      } catch (e) {
        console.warn(`Skipping ${s.file}: ${(e as Error).message.split("\n")[0]}`);
      }
    }
    return out;
  }

  private async mergeModules(track: SeedTrack, name: string): Promise<SeedTrack> {
    for (let i = 0; i < 10; i += 1) {
      const key = `m${String(i + 1).padStart(2, "0")}`;
      try {
        const mod = (await import(`./seed/${name}/${key}.ts`)) as Record<string, SeedModule>;
        const expanded = mod[key];
        if (!expanded) continue;
        const questions = expanded.lessons.reduce((n, l) => n + l.problems.length, 0);
        const current = track.modules[i]?.lessons.reduce((n, l) => n + l.problems.length, 0) ?? 0;
        if (questions > current) track.modules[i] = expanded;
      } catch {
        continue;
      }
    }
    return track;
  }

  private async videos(): Promise<Record<string, string>> {
    try {
      return JSON.parse(await readFile(new URL("./seed/videos.json", import.meta.url), "utf8")) as Record<string, string>;
    } catch {
      return {};
    }
  }

  private attachVideos(track: SeedTrack, videos: Record<string, string>): SeedTrack {
    for (const m of track.modules) {
      for (const l of m.lessons) {
        const id = videos[`${track.slug}::${l.title}`];
        if (id && !l.videoId) l.videoId = id;
        l.problems = l.problems.filter((p) => p.type === "mcq");
      }
    }
    return track;
  }
}

class Seeder {
  constructor(
    private readonly db: ReturnType<typeof Database.connect>["db"],
    private readonly catalog: SeedTrack[],
  ) {}

  private validate(): void {
    for (const track of this.catalog) {
      let questions = 0;
      const titles = new Set<string>();
      for (const m of track.modules) {
        for (const l of m.lessons) {
          if (titles.has(l.title)) console.warn(`Duplicate lesson title in ${track.slug}: ${l.title}`);
          titles.add(l.title);
          for (const p of l.problems) {
            questions += 1;
            if (p.type === "mcq" && !(p.options?.includes(p.answer) ?? false)) {
              throw new Error(`MCQ answer not in options: ${track.slug} / ${l.title} / ${p.title}`);
            }
          }
        }
      }
      const count = track.modules.reduce((n, m) => n + m.lessons.length, 0);
      console.log(`${track.title}: ${track.modules.length} modules, ${count} lessons, ${questions} questions`);
    }
  }

  async run(): Promise<void> {
    if (!this.catalog.length) throw new Error("No track content found");
    this.validate();
    await this.db.delete(problemAttempts);
    await this.db.delete(lessonProgress);
    await this.db.delete(tracks);
    console.log("Cleared progress and attempts for all users");
    for (const [ti, track] of this.catalog.entries()) {
      const [t] = await this.db
        .insert(tracks)
        .values({ slug: track.slug, title: track.title, description: track.description, icon: track.icon, order: ti })
        .returning({ id: tracks.id });
      for (const [mi, mod] of track.modules.entries()) {
        const [m] = await this.db
          .insert(modules)
          .values({ trackId: t.id, title: mod.title, description: mod.description, order: mi })
          .returning({ id: modules.id });
        const inserted = await this.db
          .insert(lessons)
          .values(
            mod.lessons.map((lesson, li) => ({
              moduleId: m.id,
              title: lesson.title,
              content: lesson.content,
              videoId: lesson.videoId ?? null,
              durationMin: lesson.durationMin,
              order: li,
            })),
          )
          .returning({ id: lessons.id, order: lessons.order });
        const byOrder = new Map(inserted.map((r) => [r.order, r.id]));
        const rows = mod.lessons.flatMap((lesson, li) =>
          lesson.problems.map((p, pi) => ({
            lessonId: byOrder.get(li) as string,
            title: p.title,
            prompt: p.prompt,
            type: p.type,
            difficulty: p.difficulty,
            options: p.options ?? null,
            answer: p.answer,
            explanation: p.explanation,
            order: pi,
          })),
        );
        if (rows.length) await this.db.insert(problems).values(rows);
      }
    }
    console.log(`Seeded ${this.catalog.length} tracks`);
  }
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");
await new Seeder(Database.connect(url).db, await new Loader().load()).run();
const cache = new CacheService(process.env.UPSTASH_REDIS_REST_URL || null, process.env.UPSTASH_REDIS_REST_TOKEN || null);
await cache.invalidate(CacheKeys.leaderboard);
console.log(`Flushed ${await cache.flushCatalog()} cache keys and reset the leaderboard`);
