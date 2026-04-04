import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

const isPathnameProtected = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(Boolean);

  if (
    pathSegments[0] !== 'c' ||
    (pathSegments[0] === 'c' && pathSegments[2] === 'explore')
  )
    return false;

  return true;
};

const extractSubdomain = (request: NextRequest): string | null => {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }
    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
};

const getEffectivePath = (req: NextRequest) => {
  const subdomain = extractSubdomain(req);
  const { pathname } = req.nextUrl;

  if (subdomain && subdomain !== 'www') {
    // pathname has a leading slash
    return `/c/${subdomain}${pathname}`;
  }

  return pathname;
};

const isTenantApplicationPath = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/c')) {
    return true;
  }

  return false;
};

export default clerkMiddleware(async (auth, request) => {
  const subdomain = extractSubdomain(request);

  if ((!subdomain || subdomain === 'www') && isTenantApplicationPath(request)) {
    const { pathname } = request.nextUrl;
    const [, tenant, ...rest] = pathname.split('/').filter(Boolean);
    const dest = new URL(request.url);
    dest.host = `${tenant}.${rootDomain}`;
    dest.pathname = rest.length > 0 ? `/${rest.join('/')}` : '/';

    return NextResponse.redirect(dest, 308);
  }

  const effectivePath = getEffectivePath(request);

  if (isPathnameProtected(effectivePath)) {
    await auth.protect();
  }

  if (subdomain) {
    // Block access to unwanted pages from subdomains like:
    // if (pathname.startsWith('/admin')) {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }

    // Rewrite to the subdomain page
    const target = new URL(effectivePath, request.url);
    target.search = request.nextUrl.search;

    return NextResponse.rewrite(target);
  }

  // On the root domain, allow normal access
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
