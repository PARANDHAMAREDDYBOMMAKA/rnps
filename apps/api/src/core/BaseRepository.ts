import type { Db } from "../db/Database.ts";

export abstract class BaseRepository {
  constructor(protected readonly db: Db) {}
}
