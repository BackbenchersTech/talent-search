import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Candidates } from './candidates';

export const Education = pgTable('education', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => Candidates.id, { onDelete: 'cascade' }),
  school: text('school'),
  degree: text('degree').notNull(),
  fieldOfStudy: text('field_of_study'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
