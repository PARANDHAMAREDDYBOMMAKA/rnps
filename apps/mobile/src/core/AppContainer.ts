import { ApiClient } from "./ApiClient";
import { SessionStorage } from "./SessionStorage";
import { AuthService } from "@/services/AuthService";
import { ContentService } from "@/services/ContentService";
import { ProgressService } from "@/services/ProgressService";
import { AuthStore } from "@/stores/AuthStore";
import { ProgressStore } from "@/stores/ProgressStore";

export class AppContainer {
  private static instance: AppContainer;
  readonly api: ApiClient;
  readonly content: ContentService;
  readonly auth: AuthStore;
  readonly progress: ProgressStore;

  private constructor() {
    const baseUrl = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
    this.api = new ApiClient(baseUrl);
    this.content = new ContentService(this.api);
    this.auth = new AuthStore(this.api, new AuthService(this.api), new SessionStorage());
    this.progress = new ProgressStore(new ProgressService(this.api));
  }

  static get(): AppContainer {
    if (!AppContainer.instance) AppContainer.instance = new AppContainer();
    return AppContainer.instance;
  }
}

export const container = AppContainer.get();
