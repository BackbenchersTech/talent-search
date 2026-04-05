import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

const isPathnameProtected = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(Boolean);

  if (
    pathSegments[0] !== 'c' ||
    (pathSegments[0] === 'c' && pathSegments[2] === 'explore')
  ) {
    return false;
  }

  return true;
};

const extractSubdomainFromHostname = (hostname: string): string | null => {
  if (!hostname) return null;

  // Remove port from hostname for parsing
  const hostnameWithoutPort = hostname.split(':')[0] || hostname;
  const parts = hostnameWithoutPort.split('.');

  // For localhost development (e.g., subdomain.localhost or localhost)
  if (hostnameWithoutPort.includes('localhost')) {
    const subdomain = parts[0];
    return subdomain && subdomain !== 'localhost' ? subdomain : null;
  }

  // For production (e.g., subdomain.protecteddomain.com)
  if (parts.length >= 3) {
    const subdomain = parts[0];
    return subdomain && subdomain !== 'www' ? subdomain : null;
  }

  return null;
};

const isTenantApplicationPath = (pathname: string) => pathname.startsWith('/c/');

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');

  // Extract subdomain from hostname using utility function
  const subdomain = extractSubdomainFromHostname(hostname || '');

  if (subdomain) {
    // Only rewrite if not already in the /c/ structure and not an API/static route
    if (
      !url.pathname.startsWith('/c/') &&
      !url.pathname.startsWith('/api/') &&
      !url.pathname.startsWith('/_next/')
    ) {
      // Create internal rewrite URL
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = `/c/${subdomain}${url.pathname}`;

      if (isPathnameProtected(rewriteUrl.pathname)) {
        await auth.protect();
      }

      // This creates an internal rewrite that doesn't change the URL the user sees
      return NextResponse.rewrite(rewriteUrl);
    }

    // If URL already contains /c/subdomain, prevent double subdomain by redirecting to clean URL
    // BUT: Allow Next.js special routes (opengraph-image, etc.) to pass through
    if (url.pathname.startsWith(`/c/${subdomain}`)) {
      const remainingPath = url.pathname.replace(`/c/${subdomain}`, '');
      const isSpecialRoute = remainingPath.match(
        /^\/(apple-icon|opengraph-image|twitter-image)$/,
      );

      if (!isSpecialRoute) {
        const cleanPath = remainingPath || '/';
        const redirectUrl = url.clone();
        redirectUrl.pathname = cleanPath;

        return NextResponse.redirect(redirectUrl, 308);
      }
    }
  }

  // No subdomain
  if (!subdomain) {
    // if URL is in format of /c/subdomain, redirect to subdomain based URL
    if (isTenantApplicationPath(request.nextUrl.pathname)) {
      const [, tenant, ...rest] = request.nextUrl.pathname.split('/').filter(Boolean);
      const protocol = rootDomain.includes('localhost') ? 'http' : 'https';
      const redirectUrl = new URL(
        `${protocol}://${tenant}.${rootDomain}/${rest.length > 0 ? rest.join('/') : ''}`,
      );
      redirectUrl.search = request.nextUrl.search;

      return NextResponse.redirect(new URL(redirectUrl), 308);
    }

    // If not, passthrough for marketing (non-tenant) URLs
    return NextResponse.next();
  }

  // Pass through without session update to keep middleware Edge-compatible
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
