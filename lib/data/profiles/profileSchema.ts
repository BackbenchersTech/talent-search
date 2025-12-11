import { sql } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Candidates } from '../candidates/candidateSchema';

export const Profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => Candidates.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  industry: text('industry'),
  seniority: text('seniority'),
  status: text('status', {
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
  })
    .notNull()
    .default('DRAFT'),
  visibility: text('visibility', {
    enum: ['PRIVATE', 'PUBLIC'],
  })
    .notNull()
    .default('PRIVATE'),
  billRateMin: integer('bill_rate_min'),
  billRateMax: integer('bill_rate_max'),
  openForRelocation: boolean('open_for_relocation').notNull().default(false),
  headline: text('headline'),
  bio: text('bio'),
  skills: text('skills')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Index
export const profilesCandidateIdIdx = sql`
  create index if not exists profiles_candidate_id_idx 
  on profiles(candidate_id);
`;
