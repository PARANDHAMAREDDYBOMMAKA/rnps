import { z } from "zod";

const optional = z.string().optional().or(z.literal(""));

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().url(),
  UPSTASH_REDIS_REST_URL: optional,
  UPSTASH_REDIS_REST_TOKEN: optional,
  QSTASH_TOKEN: optional,
  QSTASH_CURRENT_SIGNING_KEY: optional,
  QSTASH_NEXT_SIGNING_KEY: optional,
  JWT_SECRET: z.string().min(16),
});

type EnvShape = z.infer<typeof EnvSchema>;

export class Env {
  private static instance: Env;
  readonly port: number;
  readonly databaseUrl: string;
  readonly redisUrl: string | null;
  readonly redisToken: string | null;
  readonly qstashToken: string | null;
  readonly qstashSigningKeys: { current: string; next: string } | null;
  readonly jwtSecret: string;

  private constructor(raw: EnvShape) {
    this.port = raw.PORT;
    this.databaseUrl = raw.DATABASE_URL;
    this.redisUrl = raw.UPSTASH_REDIS_REST_URL || null;
    this.redisToken = raw.UPSTASH_REDIS_REST_TOKEN || null;
    this.qstashToken = raw.QSTASH_TOKEN || null;
    this.qstashSigningKeys =
      raw.QSTASH_CURRENT_SIGNING_KEY && raw.QSTASH_NEXT_SIGNING_KEY
        ? { current: raw.QSTASH_CURRENT_SIGNING_KEY, next: raw.QSTASH_NEXT_SIGNING_KEY }
        : null;
    this.jwtSecret = raw.JWT_SECRET;
  }

  static get(): Env {
    if (!Env.instance) {
      const parsed = EnvSchema.safeParse(process.env);
      if (!parsed.success) {
        const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
        throw new Error(`Invalid environment: ${missing}`);
      }
      Env.instance = new Env(parsed.data);
    }
    return Env.instance;
  }

  get hasRedis(): boolean {
    return Boolean(this.redisUrl && this.redisToken);
  }

  get hasQstash(): boolean {
    return Boolean(this.qstashToken);
  }
}
