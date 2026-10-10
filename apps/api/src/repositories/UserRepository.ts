import { eq, inArray } from "drizzle-orm";
import { BaseRepository } from "../core/BaseRepository.ts";
import { users, type UserRow } from "../db/schema.ts";

export class UserRepository extends BaseRepository {
  findByEmail(email: string): Promise<UserRow | undefined> {
    return this.db.query.users.findFirst({ where: eq(users.email, email) });
  }

  findById(id: string): Promise<UserRow | undefined> {
    return this.db.query.users.findFirst({ where: eq(users.id, id) });
  }

  async findNamesByIds(ids: string[]): Promise<Map<string, string>> {
    if (!ids.length) return new Map();
    const rows = await this.db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(inArray(users.id, ids));
    return new Map(rows.map((r) => [r.id, r.name]));
  }

  async create(data: { name: string; email: string; passwordHash: string }): Promise<UserRow> {
    const [row] = await this.db.insert(users).values(data).returning();
    return row;
  }
}
