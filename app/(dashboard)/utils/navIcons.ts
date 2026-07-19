import { NavKeys, type NavKey } from '@/app/(dashboard)/utils/navigation';
import {
  ArrowTrendingUpIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType } from 'react';

export const NAV_ICONS: Record<NavKey, ComponentType<{ className?: string }>> = {
  [NavKeys.EXPLORE]: MagnifyingGlassIcon,
  [NavKeys.HOME]: HomeIcon,
  [NavKeys.CANDIDATES]: UsersIcon,
  [NavKeys.ANALYTICS]: ArrowTrendingUpIcon,
};
