import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const problemTypeEnum = pgEnum("problem_type", ["mcq", "coding"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const tracks = pgTable("tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
});

export const modules = pgTable(
  "modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    order: integer("order").notNull().default(0),
  },
  (t) => [index("modules_track_idx").on(t.trackId)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    videoId: text("video_id"),
    durationMin: integer("duration_min").notNull().default(5),
    order: integer("order").notNull().default(0),
  },
  (t) => [index("lessons_module_idx").on(t.moduleId)],
);

export const problems = pgTable(
  "problems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    prompt: text("prompt").notNull(),
    type: problemTypeEnum("type").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    options: jsonb("options").$type<string[]>(),
    answer: text("answer").notNull(),
    explanation: text("explanation").notNull(),
    order: integer("order").notNull().default(0),
  },
  (t) => [index("problems_lesson_idx").on(t.lessonId)],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const problemAttempts = pgTable(
  "problem_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
    answer: text("answer").notNull(),
    correct: boolean("correct").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("attempts_user_problem_idx").on(t.userId, t.problemId)],
);

export const tracksRelations = relations(tracks, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  track: one(tracks, { fields: [modules.trackId], references: [tracks.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, { fields: [lessons.moduleId], references: [modules.id] }),
  problems: many(problems),
}));

export const problemsRelations = relations(problems, ({ one }) => ({
  lesson: one(lessons, { fields: [problems.lessonId], references: [lessons.id] }),
}));

export type UserRow = typeof users.$inferSelect;
export type TrackRow = typeof tracks.$inferSelect;
export type ModuleRow = typeof modules.$inferSelect;
export type LessonRow = typeof lessons.$inferSelect;
export type ProblemRow = typeof problems.$inferSelect;
