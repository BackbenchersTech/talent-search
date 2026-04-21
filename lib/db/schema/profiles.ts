import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { Candidates } from './candidates';
import { Organizations } from './organizations';

const statusValues = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
const visibilityValues = ['PRIVATE', 'PUBLIC'] as const;

export const Profiles = pgTable(
  'profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => Candidates.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    industry: text('industry'),
    seniority: text('seniority'),
    status: text('status', { enum: statusValues }).notNull().default('DRAFT'),
    visibility: text('visibility', { enum: visibilityValues })
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
      .default(sql`'{}'`),
    viewCount: integer('view_count').default(0),
    organizationId: uuid('organization_id').references(() => Organizations.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('profiles_status_check', sql`${table.status} = ANY (${statusValues})`),
    check(
      'profiles_visibility_check',
      sql`${table.visibility} = ANY (${visibilityValues})`,
    ),
    // Indexes
    index('profiles_candidate_id_idx').on(table.candidateId),
    index('idx_profiles_organization_id').on(table.organizationId),
    index('idx_profiles_org_id_id').on(table.organizationId, table.id),
  ],
);
