import type { LessonDto, ProblemDto, TrackDetailDto, TrackDto } from "@rnp/shared";
import type { ApiClient } from "@/core/ApiClient";

export class ContentService {
  constructor(private readonly api: ApiClient) {}

  tracks(): Promise<TrackDto[]> {
    return this.api.get<TrackDto[]>("/content/tracks");
  }

  track(id: string): Promise<TrackDetailDto> {
    return this.api.get<TrackDetailDto>(`/content/tracks/${id}`);
  }

  lesson(id: string): Promise<LessonDto> {
    return this.api.get<LessonDto>(`/content/lessons/${id}`);
  }

  lessonProblems(lessonId: string): Promise<ProblemDto[]> {
    return this.api.get<ProblemDto[]>(`/content/lessons/${lessonId}/problems`);
  }

  problem(id: string): Promise<ProblemDto> {
    return this.api.get<ProblemDto>(`/content/problems/${id}`);
  }
}
