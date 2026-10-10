import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";

export type Db = NeonHttpDatabase<typeof schema>;

export class Database {
  private static instance: Database;
  readonly db: Db;

  private constructor(url: string) {
    this.db = drizzle(neon(url), { schema });
  }

  static connect(url: string): Database {
    if (!Database.instance) Database.instance = new Database(url);
    return Database.instance;
  }
}
