import type { LessonDto, ProblemDto, TrackDetailDto, TrackDto } from "@rnp/shared";
import { CacheKeys, CacheTtl, type CacheService } from "../cache/CacheService.ts";
import { HttpError } from "../core/HttpError.ts";
import type { ProblemRow } from "../db/schema.ts";
import type { ContentRepository } from "../repositories/ContentRepository.ts";

export class ContentService {
  constructor(
    private readonly content: ContentRepository,
    private readonly cache: CacheService,
  ) {}

  listTracks(): Promise<TrackDto[]> {
    return this.cache.remember(CacheKeys.tracks, CacheTtl.catalog, () => this.content.listTracks());
  }

  getTrack(id: string): Promise<TrackDetailDto> {
    return this.cache.remember(CacheKeys.track(id), CacheTtl.catalog, async () => {
      const track = await this.content.findTrack(id);
      if (!track) throw HttpError.notFound("Track");
      const modules = track.modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        order: m.order,
        lessons: m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          durationMin: l.durationMin,
          order: l.order,
          problemCount: l.problems.length,
        })),
      }));
      return {
        id: track.id,
        slug: track.slug,
        title: track.title,
        description: track.description,
        icon: track.icon,
        moduleCount: modules.length,
        lessonCount: modules.reduce((n, m) => n + m.lessons.length, 0),
        modules,
      };
    });
  }

  getLesson(id: string): Promise<LessonDto> {
    return this.cache.remember(CacheKeys.lesson(id), CacheTtl.catalog, async () => {
      const lesson = await this.content.findLesson(id);
      if (!lesson) throw HttpError.notFound("Lesson");
      return {
        id: lesson.id,
        moduleId: lesson.moduleId,
        title: lesson.title,
        content: lesson.content,
        videoId: lesson.videoId,
        durationMin: lesson.durationMin,
        order: lesson.order,
        problemCount: lesson.problems.length,
        problems: lesson.problems,
      };
    });
  }

  async getProblem(id: string): Promise<ProblemDto> {
    return ContentService.toProblemDto(await this.loadProblem(id));
  }

  getLessonProblems(lessonId: string): Promise<ProblemDto[]> {
    return this.cache.remember(CacheKeys.lessonProblems(lessonId), CacheTtl.catalog, async () => {
      const rows = await this.content.findLessonProblems(lessonId);
      if (!rows.length) {
        await this.getLesson(lessonId);
        return [];
      }
      return rows.map(ContentService.toProblemDto);
    });
  }

  private static toProblemDto(row: ProblemRow): ProblemDto {
    return {
      id: row.id,
      lessonId: row.lessonId,
      title: row.title,
      prompt: row.prompt,
      type: row.type,
      difficulty: row.difficulty,
      options: row.options ?? null,
      order: row.order,
    };
  }

  loadProblem(id: string): Promise<ProblemRow> {
    return this.cache.remember(CacheKeys.problem(id), CacheTtl.catalog, async () => {
      const row = await this.content.findProblem(id);
      if (!row) throw HttpError.notFound("Problem");
      return row;
    });
  }
}
