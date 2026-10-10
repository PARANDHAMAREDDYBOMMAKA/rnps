import { readFile, writeFile } from "node:fs/promises";
import { eq, isNull } from "drizzle-orm";
import { CacheKeys, CacheService } from "../cache/CacheService.ts";
import { Database } from "./Database.ts";
import { lessons, modules, tracks } from "./schema.ts";

const VIDEO_MAP = new URL("./seed/videos.json", import.meta.url);

const preferredChannels = [
  "neetcode",
  "abdul bari",
  "bytebytego",
  "gaurav sen",
  "freecodecamp.org",
  "back to back swe",
  "hussein nasser",
  "fireship",
  "mycodeschool",
  "cs dojo",
  "exponent",
  "tech with tim",
  "codekarle",
  "take u forward",
  "jenny's lectures",
  "gate smashers",
  "kunal kushwaha",
  "apna college",
];

interface SearchItem {
  id: { videoId: string };
  snippet: { title: string; channelTitle: string };
}

interface VideoItem {
  id: string;
  contentDetails: { duration: string };
  status: { embeddable: boolean };
}

interface Candidate {
  id: string;
  title: string;
  channel: string;
  seconds: number;
  embeddable: boolean;
}

class YouTube {
  constructor(private readonly key: string) {}

  private async get<T>(path: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
    for (const [k, v] of Object.entries({ ...params, key: this.key })) url.searchParams.set(k, v);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${path} ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as T;
  }

  async candidates(query: string): Promise<Candidate[]> {
    const search = await this.get<{ items: SearchItem[] }>("search", {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: "8",
      relevanceLanguage: "en",
      safeSearch: "strict",
      videoEmbeddable: "true",
      videoSyndicated: "true",
    });
    const ids = search.items.map((i) => i.id.videoId).filter(Boolean);
    if (!ids.length) return [];
    const details = await this.get<{ items: VideoItem[] }>("videos", { part: "contentDetails,status", id: ids.join(",") });
    const byId = new Map(details.items.map((v) => [v.id, v]));
    return search.items
      .filter((i) => byId.has(i.id.videoId))
      .map((i) => {
        const v = byId.get(i.id.videoId) as VideoItem;
        return {
          id: i.id.videoId,
          title: i.snippet.title,
          channel: i.snippet.channelTitle,
          seconds: YouTube.seconds(v.contentDetails.duration),
          embeddable: v.status.embeddable,
        };
      });
  }

  static seconds(iso: string): number {
    const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
    if (!m) return 0;
    return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  }
}

class Picker {
  pick(items: Candidate[]): Candidate | null {
    const usable = items.filter((c) => c.embeddable && c.seconds >= 180 && c.seconds <= 60 * 60);
    const preferred = usable.find((c) => preferredChannels.some((p) => c.channel.toLowerCase().includes(p)));
    return preferred ?? usable[0] ?? null;
  }
}

class VideoMap {
  private data: Record<string, string> = {};

  async load(): Promise<void> {
    try {
      this.data = JSON.parse(await readFile(VIDEO_MAP, "utf8")) as Record<string, string>;
    } catch {
      this.data = {};
    }
  }

  get size(): number {
    return Object.keys(this.data).length;
  }

  get(key: string): string | undefined {
    return this.data[key];
  }

  set(key: string, id: string): void {
    this.data[key] = id;
  }

  save(): Promise<void> {
    const sorted = Object.fromEntries(Object.entries(this.data).sort(([a], [b]) => a.localeCompare(b)));
    return writeFile(VIDEO_MAP, `${JSON.stringify(sorted, null, 2)}\n`);
  }
}

const topicHint: Record<string, string> = {
  dsa: "data structures algorithms explained",
  "system-design": "system design interview",
  "interview-readiness": "software engineer interview tips",
};

const run = async () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const key = process.env.YOUTUBE_API_KEY || null;
  const limit = Number(process.env.VIDEO_LIMIT ?? 90);

  const { db } = Database.connect(url);
  const yt = key ? new YouTube(key) : null;
  const picker = new Picker();
  const map = new VideoMap();
  await map.load();
  console.log(`${map.size} videos in the map${yt ? ", YouTube search enabled" : ", applying map only (no API key)"}`);

  const pending = await db
    .select({ id: lessons.id, title: lessons.title, slug: tracks.slug, module: modules.title })
    .from(lessons)
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .innerJoin(tracks, eq(tracks.id, modules.trackId))
    .where(isNull(lessons.videoId));

  console.log(`${pending.length} lessons without a video`);
  let searched = 0;
  let filled = 0;
  for (const lesson of pending) {
    const mapKey = `${lesson.slug}::${lesson.title}`;
    let videoId = map.get(mapKey);
    if (!videoId && yt) {
      if (searched >= limit) break;
      searched += 1;
      const query = `${lesson.title} ${lesson.module} ${topicHint[lesson.slug] ?? ""}`.trim();
      try {
        const choice = picker.pick(await yt.candidates(query));
        if (choice) {
          videoId = choice.id;
          map.set(mapKey, videoId);
          console.log(`${lesson.title} -> ${choice.channel}: ${choice.title}`);
        }
      } catch (e) {
        console.error(`Search failed for ${lesson.title}: ${(e as Error).message}`);
        break;
      }
    }
    if (!videoId) continue;
    await db.update(lessons).set({ videoId }).where(eq(lessons.id, lesson.id));
    filled += 1;
  }
  await map.save();
  const cache = new CacheService(process.env.UPSTASH_REDIS_REST_URL || null, process.env.UPSTASH_REDIS_REST_TOKEN || null);
  await cache.flushCatalog();
  await cache.invalidate(CacheKeys.tracks);
  console.log(`Filled ${filled} lessons${searched ? ` using ${searched} searches` : ""}. Remaining without video: ${pending.length - filled}`);
};

await run();
