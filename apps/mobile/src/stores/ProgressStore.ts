import type { LeaderboardEntryDto, ProgressSummaryDto, SubmissionResultDto } from "@rnp/shared";
import { Store } from "@/core/Store";
import type { ProgressService } from "@/services/ProgressService";

export interface ProgressState {
  summary: ProgressSummaryDto | null;
  loading: boolean;
  fetchedAt: number;
}

const empty: ProgressSummaryDto = {
  completedLessons: 0,
  solvedProblems: 0,
  totalPoints: 0,
  streakDays: 0,
  rank: null,
  recentDays: [],
  nextLesson: null,
  trackProgress: {},
  completedLessonIds: [],
  solvedProblemIds: [],
};

export class ProgressStore extends Store<ProgressState> {
  private inflight: Promise<void> | null = null;

  constructor(private readonly service: ProgressService) {
    super({ summary: null, loading: false, fetchedAt: 0 });
  }

  get summary(): ProgressSummaryDto {
    return this.state.summary ?? empty;
  }

  refresh(): Promise<void> {
    if (this.inflight) return this.inflight;
    this.setState({ loading: true });
    this.inflight = this.service
      .summary()
      .then((summary) => this.setState({ summary, fetchedAt: Date.now() }))
      .catch(() => undefined)
      .finally(() => {
        this.setState({ loading: false });
        this.inflight = null;
      });
    return this.inflight;
  }

  refreshIfStale(maxAgeMs = 4000): Promise<void> {
    if (Date.now() - this.state.fetchedAt < maxAgeMs) return Promise.resolve();
    return this.refresh();
  }

  reset(): void {
    this.setState({ summary: null, loading: false, fetchedAt: 0 });
  }

  isLessonDone(id: string): boolean {
    return this.summary.completedLessonIds.includes(id);
  }

  isProblemSolved(id: string): boolean {
    return this.summary.solvedProblemIds.includes(id);
  }

  leaderboard(): Promise<LeaderboardEntryDto[]> {
    return this.service.leaderboard();
  }

  async completeLesson(id: string): Promise<number> {
    const { pointsAwarded } = await this.service.completeLesson(id);
    await this.refresh();
    return pointsAwarded;
  }

  async submit(problemId: string, answer: string): Promise<SubmissionResultDto> {
    const result = await this.service.submit(problemId, answer);
    await this.refresh();
    return result;
  }
}
