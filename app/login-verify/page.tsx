import { OrganizationList } from '@clerk/nextjs';

export default async function OnboardingPage() {
  return (
    <div className='flex h-full items-center justify-center'>
      <OrganizationList afterSelectOrganizationUrl='/c/:slug/home' />
    </div>
  );
}
