import { CreateOrganization } from '@clerk/nextjs';

export default async function OnboardingPage() {
  return (
    <div className='flex h-full items-center justify-center'>
      <CreateOrganization afterCreateOrganizationUrl='/onboarding/verify' />
    </div>
  );
}
