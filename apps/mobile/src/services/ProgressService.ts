import type { LeaderboardEntryDto, ProgressSummaryDto, SubmissionResultDto } from "@rnp/shared";
import type { ApiClient } from "@/core/ApiClient";

export class ProgressService {
  constructor(private readonly api: ApiClient) {}

  summary(): Promise<ProgressSummaryDto> {
    return this.api.get<ProgressSummaryDto>("/progress/summary");
  }

  leaderboard(): Promise<LeaderboardEntryDto[]> {
    return this.api.get<LeaderboardEntryDto[]>("/progress/leaderboard");
  }

  completeLesson(lessonId: string): Promise<{ pointsAwarded: number }> {
    return this.api.post<{ pointsAwarded: number }>(`/progress/lessons/${lessonId}/complete`);
  }

  submit(problemId: string, answer: string): Promise<SubmissionResultDto> {
    return this.api.post<SubmissionResultDto>(`/progress/problems/${problemId}/submit`, { answer });
  }
}
