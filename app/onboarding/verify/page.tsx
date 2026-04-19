'use client';

import { useOrganization } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function OnboardingVerifyPage() {
  const { organization, isLoaded } = useOrganization();

  useEffect(() => {
    if (isLoaded && organization?.slug) {
      const protocol = window.location.protocol;
      const host = window.location.host.split('.').slice(-2);

      if (host.includes('localhost:3000')) {
        window.location.href = `${protocol}//${host.join('.')}/c/${organization.slug}/home`;
      } else {
        window.location.href = `${protocol}//${organization.slug}.${host.join('.')}/home`;
      }
    }
  }, [isLoaded, organization]);

  return <>Setting up your workspace...</>;
}
