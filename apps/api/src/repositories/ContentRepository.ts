import { asc, eq, sql } from "drizzle-orm";
import { BaseRepository } from "../core/BaseRepository.ts";
import { lessons, modules, problems, tracks, type ProblemRow } from "../db/schema.ts";

export interface TrackWithCounts {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  moduleCount: number;
  lessonCount: number;
}

export class ContentRepository extends BaseRepository {
  async listTracks(): Promise<TrackWithCounts[]> {
    const rows = await this.db
      .select({
        id: tracks.id,
        slug: tracks.slug,
        title: tracks.title,
        description: tracks.description,
        icon: tracks.icon,
        moduleCount: sql<number>`count(distinct ${modules.id})`.mapWith(Number),
        lessonCount: sql<number>`count(${lessons.id})`.mapWith(Number),
      })
      .from(tracks)
      .leftJoin(modules, eq(modules.trackId, tracks.id))
      .leftJoin(lessons, eq(lessons.moduleId, modules.id))
      .groupBy(tracks.id)
      .orderBy(asc(tracks.order));
    return rows;
  }

  findTrack(id: string) {
    return this.db.query.tracks.findFirst({
      where: eq(tracks.id, id),
      with: {
        modules: {
          orderBy: asc(modules.order),
          with: {
            lessons: {
              orderBy: asc(lessons.order),
              columns: { id: true, title: true, durationMin: true, order: true },
              with: { problems: { columns: { id: true } } },
            },
          },
        },
      },
    });
  }

  findLesson(id: string) {
    return this.db.query.lessons.findFirst({
      where: eq(lessons.id, id),
      with: {
        problems: {
          orderBy: asc(problems.order),
          columns: { id: true, title: true, type: true, difficulty: true, order: true },
        },
      },
    });
  }

  findProblem(id: string): Promise<ProblemRow | undefined> {
    return this.db.query.problems.findFirst({ where: eq(problems.id, id) });
  }

  findLessonProblems(lessonId: string): Promise<ProblemRow[]> {
    return this.db.query.problems.findMany({ where: eq(problems.lessonId, lessonId), orderBy: asc(problems.order) });
  }
}
