import { pgEnum } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // hashed
  role: userRoleEnum(),
  phone: varchar("phone", { length: 20 }),
  cpf: varchar("cpf", { length: 14 }).unique(),
  is_active:  boolean("is_active").notNull().default(false),
  confirm_token: varchar("confirm_token", { length: 255 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
