import { Redis } from "@upstash/redis";

export interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  del(...keys: string[]): Promise<void>;
  keys(pattern: string): Promise<string[]>;
  zincrby(key: string, increment: number, member: string): Promise<void>;
  ztop(key: string, count: number): Promise<{ member: string; score: number }[]>;
  zrank(key: string, member: string): Promise<number | null>;
}

class MemoryStore implements CacheStore {
  private readonly map = new Map<string, { value: unknown; expiresAt: number }>();
  private readonly sorted = new Map<string, Map<string, number>>();

  async get<T>(key: string): Promise<T | null> {
    const hit = this.map.get(key);
    if (!hit) return null;
    if (hit.expiresAt < Date.now()) {
      this.map.delete(key);
      return null;
    }
    return hit.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.map.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async del(...keys: string[]): Promise<void> {
    for (const key of keys) this.map.delete(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const prefix = pattern.replace(/\*$/, "");
    return [...this.map.keys()].filter((k) => k.startsWith(prefix));
  }

  async zincrby(key: string, increment: number, member: string): Promise<void> {
    const set = this.sorted.get(key) ?? new Map<string, number>();
    set.set(member, (set.get(member) ?? 0) + increment);
    this.sorted.set(key, set);
  }

  private ranked(key: string): { member: string; score: number }[] {
    const set = this.sorted.get(key);
    if (!set) return [];
    return [...set.entries()].sort((a, b) => b[1] - a[1]).map(([member, score]) => ({ member, score }));
  }

  async ztop(key: string, count: number): Promise<{ member: string; score: number }[]> {
    return this.ranked(key).slice(0, count);
  }

  async zrank(key: string, member: string): Promise<number | null> {
    const i = this.ranked(key).findIndex((r) => r.member === member);
    return i < 0 ? null : i;
  }
}

class RedisStore implements CacheStore {
  constructor(private readonly redis: Redis) {}

  get<T>(key: string): Promise<T | null> {
    return this.redis.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, { ex: ttlSeconds });
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length) await this.redis.del(...keys);
  }

  keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  async zincrby(key: string, increment: number, member: string): Promise<void> {
    await this.redis.zincrby(key, increment, member);
  }

  async ztop(key: string, count: number): Promise<{ member: string; score: number }[]> {
    const raw = await this.redis.zrange<string[]>(key, 0, count - 1, { rev: true, withScores: true });
    const out: { member: string; score: number }[] = [];
    for (let i = 0; i < raw.length; i += 2) out.push({ member: raw[i], score: Number(raw[i + 1]) });
    return out;
  }

  async zrank(key: string, member: string): Promise<number | null> {
    const score = await this.redis.zscore(key, member);
    if (score === null) return null;
    return this.redis.zcount(key, `(${score}`, "+inf");
  }
}

export class CacheService {
  private readonly store: CacheStore;

  constructor(url: string | null, token: string | null) {
    this.store = url && token ? new RedisStore(new Redis({ url, token })) : new MemoryStore();
  }

  async remember<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
    const cached = await this.store.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await loader();
    await this.store.set(key, fresh, ttlSeconds);
    return fresh;
  }

  invalidate(...keys: string[]): Promise<void> {
    return this.store.del(...keys);
  }

  async flushCatalog(): Promise<number> {
    const groups = await Promise.all(["track:*", "lesson:*", "problem:*", "progress:*"].map((p) => this.store.keys(p)));
    const keys = [CacheKeys.tracks, ...groups.flat()];
    await this.store.del(...keys);
    return keys.length;
  }

  addScore(board: string, member: string, points: number): Promise<void> {
    return this.store.zincrby(board, points, member);
  }

  topScores(board: string, count: number): Promise<{ member: string; score: number }[]> {
    return this.store.ztop(board, count);
  }

  async rankOf(board: string, member: string): Promise<number | null> {
    const i = await this.store.zrank(board, member);
    return i === null ? null : i + 1;
  }
}

export const CacheKeys = {
  tracks: "tracks:all",
  track: (id: string) => `track:${id}`,
  lesson: (id: string) => `lesson:${id}`,
  lessonProblems: (id: string) => `lesson:${id}:problems`,
  problem: (id: string) => `problem:${id}`,
  progress: (userId: string) => `progress:${userId}`,
  leaderboard: "leaderboard:points",
} as const;

export const CacheTtl = {
  catalog: 60 * 60,
  progress: 60,
} as const;
