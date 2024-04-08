import { integer, text, boolean, pgTable, uuid, json } from "drizzle-orm/pg-core";


export type Geo = {
  lat: number;
  long: number;
} & {_brand : "Geo"};

export const venue = pgTable("venue", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  location: text("location").notNull(),
  capacity: integer("capacity").notNull(),
  geo: json('geo').$type<Geo>().notNull(),
});

export const match = pgTable("match", {
  id: uuid('id').defaultRandom().primaryKey(),
  date: text("date").notNull(),
  teamA: text("teamA").notNull(),
  teamB: text("teamB").notNull(),
  location: text("location").notNull(),
});