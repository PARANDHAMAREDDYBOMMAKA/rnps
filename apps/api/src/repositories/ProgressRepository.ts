import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { BaseRepository } from "../core/BaseRepository.ts";
import { lessonProgress, lessons, modules, problemAttempts, problems, tracks } from "../db/schema.ts";

export interface SolvedProblem {
  problemId: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface NextLesson {
  lessonId: string;
  lessonTitle: string;
  durationMin: number;
  moduleTitle: string;
  trackId: string;
  trackTitle: string;
  trackIcon: string;
}

export class ProgressRepository extends BaseRepository {
  async completeLesson(userId: string, lessonId: string): Promise<boolean> {
    const inserted = await this.db
      .insert(lessonProgress)
      .values({ userId, lessonId })
      .onConflictDoNothing()
      .returning({ lessonId: lessonProgress.lessonId });
    return inserted.length > 0;
  }

  async completedLessonIds(userId: string): Promise<string[]> {
    const rows = await this.db
      .select({ lessonId: lessonProgress.lessonId })
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId));
    return rows.map((r) => r.lessonId);
  }

  async hasSolved(userId: string, problemId: string): Promise<boolean> {
    const row = await this.db.query.problemAttempts.findFirst({
      where: and(
        eq(problemAttempts.userId, userId),
        eq(problemAttempts.problemId, problemId),
        eq(problemAttempts.correct, true),
      ),
      columns: { id: true },
    });
    return Boolean(row);
  }

  async recordAttempt(userId: string, problemId: string, answer: string, correct: boolean): Promise<void> {
    await this.db.insert(problemAttempts).values({ userId, problemId, answer, correct });
  }

  async solvedProblems(userId: string): Promise<SolvedProblem[]> {
    return this.db
      .selectDistinct({ problemId: problemAttempts.problemId, difficulty: problems.difficulty })
      .from(problemAttempts)
      .innerJoin(problems, eq(problems.id, problemAttempts.problemId))
      .where(and(eq(problemAttempts.userId, userId), eq(problemAttempts.correct, true)));
  }

  async activeDays(userId: string, limit = 60): Promise<string[]> {
    const day = sql<string>`to_char(${problemAttempts.createdAt} at time zone 'utc', 'YYYY-MM-DD')`;
    const lessonDay = sql<string>`to_char(${lessonProgress.completedAt} at time zone 'utc', 'YYYY-MM-DD')`;
    const [attempts, completions] = await Promise.all([
      this.db.selectDistinct({ day }).from(problemAttempts).where(eq(problemAttempts.userId, userId)),
      this.db.selectDistinct({ day: lessonDay }).from(lessonProgress).where(eq(lessonProgress.userId, userId)),
    ]);
    const days = new Set<string>([...attempts.map((r) => r.day), ...completions.map((r) => r.day)]);
    return [...days].sort((a, b) => (a < b ? 1 : -1)).slice(0, limit);
  }

  async completedByTrack(userId: string): Promise<Record<string, number>> {
    const rows = await this.db
      .select({ trackId: modules.trackId, count: sql<number>`count(*)`.mapWith(Number) })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
      .innerJoin(modules, eq(modules.id, lessons.moduleId))
      .where(eq(lessonProgress.userId, userId))
      .groupBy(modules.trackId);
    return Object.fromEntries(rows.map((r) => [r.trackId, r.count]));
  }

  async nextLesson(userId: string): Promise<NextLesson | null> {
    const [row] = await this.db
      .select({
        lessonId: lessons.id,
        lessonTitle: lessons.title,
        durationMin: lessons.durationMin,
        moduleTitle: modules.title,
        trackId: tracks.id,
        trackTitle: tracks.title,
        trackIcon: tracks.icon,
      })
      .from(lessons)
      .innerJoin(modules, eq(modules.id, lessons.moduleId))
      .innerJoin(tracks, eq(tracks.id, modules.trackId))
      .leftJoin(lessonProgress, and(eq(lessonProgress.lessonId, lessons.id), eq(lessonProgress.userId, userId)))
      .where(isNull(lessonProgress.lessonId))
      .orderBy(asc(tracks.order), asc(modules.order), asc(lessons.order), desc(lessons.id))
      .limit(1);
    return row ?? null;
  }
}
