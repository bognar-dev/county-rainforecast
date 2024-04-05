import { integer, text, boolean, pgTable, uuid } from "drizzle-orm/pg-core";

export const match = pgTable("match", {
  id: uuid('id').defaultRandom().primaryKey(),
  date: text("date").notNull(),
  teamA: text("teamA").notNull(),
  teamB: text("teamB").notNull(),
  location: text("location").notNull(),
});