import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { Profiles } from './profiles';

export const locationTypeValues = ['REMOTE', 'HYBRID', 'ONSITE'] as const;
export type LocationType = (typeof locationTypeValues)[number];

export const experienceSourceValues = ['SDR', 'RESUME'] as const;
export type ExperienceSource = (typeof experienceSourceValues)[number];

export const Experiences = pgTable(
  'experiences',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => Profiles.id, {
        onDelete: 'cascade',
      }),
    title: text('title').notNull(),
    company: text('company').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    isCurrent: boolean('is_current').notNull().default(false),
    description: text('description'),
    locationText: text('location_text'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    locationType: text('location_type', {
      enum: locationTypeValues,
    }),
    source: text('source', {
      enum: experienceSourceValues,
    }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'experiences_location_type_check',
      sql`${table.locationType} = ANY (ARRAY['REMOTE', 'HYBRID', 'ONSITE'])`,
    ),

    check(
      'experiences_source_check',
      sql`${table.source} = ANY (ARRAY['SDR', 'RESUME'])`,
    ),

    check(
      'experiences_date_check',
      sql`${table.isCurrent} = true OR ${table.endDate} IS NOT NULL`,
    ),

    check(
      'experiences_current_end_date_check',
      sql`${table.isCurrent} = false OR ${table.endDate} IS NULL`,
    ),

    check(
      'experiences_date_order_check',
      sql`${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
  ],
);
