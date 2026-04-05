/* eslint-disable @typescript-eslint/no-explicit-any */
import postgres from 'postgres';
import { retryPromise } from '../utils/retryPromise';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const handleUserCreated = async (data: any) => {
  const email = data.email_addresses?.[0]?.email_address ?? null;
  const name = `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim();

  if (!email) {
    throw new Error('No email address');
  }

  await sql`
    INSERT INTO users (clerk_user_id, email, name)
    VALUES (${data.id}, ${email}, ${name})
    ON CONFLICT (clerk_user_id)
    DO UPDATE SET 
      email = EXCLUDED.email,
      name = EXCLUDED.name
  `;
};

const handleOrganizationCreated = async (data: any) => {
  await sql`
    INSERT INTO organizations (clerk_org_id, name, slug)
    VALUES (${data.id}, ${data.name}, ${data.slug})
    ON CONFLICT (clerk_org_id)
    DO UPDATE SET
      name = EXCLUDED.name,
      slug = EXCLUDED.slug
  `;
};

const handleMembershipCreated = async (data: any) => {
  const clerkUserId = data.public_user_data.user_id;
  const clerkOrgId = data.organization.id;

  // get internal userId
  const [user] =
    await sql`SELECT id FROM users WHERE clerk_user_id = ${clerkUserId} LIMIT 1`;

  // get internal organizationID
  const [organization] =
    await sql`SELECT id FROM organizations WHERE clerk_organization_id = ${clerkOrgId} LIMIT 1`;

  if (!user || !organization) {
    console.log('Missing user or organization for membership');
    return;
  }

  // TODO: Map role
  const role = 'sdr';

  await sql`
    INSERT INTO memberships (user_id, organization_id, role)
    VALUES (${user.id}, ${organization.id}, ${role})
    ON CONFLICT (user_id, organization_id)
    DO UPDATE SET role = EXCLUDED.role
  `;
};

export const handleClerkWebhook = async (event: any) => {
  const { data, type } = event;

  switch (type) {
    case 'user.created':
      await handleUserCreated(data);
      break;

    case 'organization.created':
      await handleOrganizationCreated(data);
      break;

    case 'organizationMembership.created':
      await retryPromise(() => handleMembershipCreated(data));
      break;

    default:
      console.log('Unhandled event:', event.type);
  }
};
