import {
  CandidateAvailability,
  CandidateStatus,
} from '@/lib/data/candidates/candidateTypes';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const Candidates = pgTable('candidates', {
  id: uuid('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  profileImageUrl: text('profile_image_url'),
  title: text('title'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  availability: text('availability').$type<CandidateAvailability>(),
  status: text('status').$type<CandidateStatus>(),
  email: text('email'),
  phone: text('phone'),
  payRateMin: integer('pay_rate_min'),
  payRateMax: integer('pay_rate_max'),
  payCurrency: text('pay_currency'),
  education: text('education'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
