import { getClerkAuthContext } from './getClerkAuthContext';
import { getOrgIdFromClerkId } from './getOrgIdFromClerkId';

export async function getAppContext() {
  const { userId, orgId: clerkOrgId } = await getClerkAuthContext();

  const orgId = await getOrgIdFromClerkId(clerkOrgId);

  return {
    userId,
    orgId: orgId,
  };
}
