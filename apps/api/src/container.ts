import { CacheService } from "./cache/CacheService.ts";
import { Env } from "./config/Env.ts";
import { Database } from "./db/Database.ts";
import { ContentRepository } from "./repositories/ContentRepository.ts";
import { ProgressRepository } from "./repositories/ProgressRepository.ts";
import { UserRepository } from "./repositories/UserRepository.ts";
import { AuthService } from "./services/AuthService.ts";
import { ContentService } from "./services/ContentService.ts";
import { PasswordHasher } from "./services/PasswordHasher.ts";
import { ProgressService } from "./services/ProgressService.ts";
import { TokenService } from "./services/TokenService.ts";

export class Container {
  readonly env: Env;
  readonly cache: CacheService;
  readonly tokens: TokenService;
  readonly auth: AuthService;
  readonly content: ContentService;
  readonly progress: ProgressService;

  constructor() {
    this.env = Env.get();
    const { db } = Database.connect(this.env.databaseUrl);
    this.cache = new CacheService(this.env.redisUrl, this.env.redisToken);
    this.tokens = new TokenService(this.env.jwtSecret);
    const users = new UserRepository(db);
    const content = new ContentRepository(db);
    const progress = new ProgressRepository(db);
    this.auth = new AuthService(users, new PasswordHasher(), this.tokens);
    this.content = new ContentService(content, this.cache);
    this.progress = new ProgressService(progress, users, this.content, this.cache);
  }
}
