export const NavKeys = {
  EXPLORE: 'EXPLORE',
  HOME: 'HOME',
  CANDIDATES: 'CANDIDATES',
  ANALYTICS: 'ANALYTICS',
} as const;

export type NavKey = (typeof NavKeys)[keyof typeof NavKeys];

export type NavItem = {
  key: NavKey;
  label: string;
  /** Absolute href, e.g. `/c/acme/explore`. */
  href: string;
};

export const orgBasePath = (domain: string) => `/c/${domain}`;

export const createNavItems = (domain: string): NavItem[] => [
  { key: NavKeys.EXPLORE, label: 'Explore', href: `${orgBasePath(domain)}/explore` },
  { key: NavKeys.HOME, label: 'Home', href: `${orgBasePath(domain)}/home` },
  {
    key: NavKeys.CANDIDATES,
    label: 'Candidates',
    href: `${orgBasePath(domain)}/candidates`,
  },
  {
    key: NavKeys.ANALYTICS,
    label: 'Analytics',
    href: `${orgBasePath(domain)}/analytics`,
  },
];

export const isActive = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);
