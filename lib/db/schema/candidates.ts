import { CandidateAvailability } from '@/lib/data/candidates/candidateTypes';
import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { Organizations } from './organizations';

const statusValues = ['ACTIVE', 'INACTIVE'] as const;

export const Candidates = pgTable(
  'candidates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    profileImageUrl: text('profile_image_url'),
    title: text('title'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    availability: text('availability').$type<CandidateAvailability>(),
    status: text('status', { enum: statusValues }).notNull().default('INACTIVE'),
    email: text('email'),
    phone: text('phone'),
    payRateMin: integer('pay_rate_min'),
    payRateMax: integer('pay_rate_max'),
    payCurrency: text('pay_currency').default('USD'),
    organizationId: uuid('organization_id')
      .references(() => Organizations.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('candidates_status_check', sql`${table.status} = ANY (${statusValues})`),
    // indexes
    index('idx_candidates_organization_id').on(table.organizationId),
    index('idx_candidates_org_id_id').on(table.organizationId, table.id),
  ],
);
