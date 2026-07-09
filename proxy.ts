import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl.clone();

  if (isPathnameProtected(url.pathname)) {
    await auth.protect();
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
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
};
