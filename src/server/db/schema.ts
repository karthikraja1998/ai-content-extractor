// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

export const content = createTable(
  "Content",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),

    url: d.varchar({ length: 2048 }).notNull().unique(), // URL should not be nullable if it's @unique

    summary: d.text(), // Optional by default

    keyPoints: d.text(), // Optional by default — could also be a JSON column if you switch to array

    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("url_idx").on(t.url)],
);
