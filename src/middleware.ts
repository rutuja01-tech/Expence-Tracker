import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is now a pass-through. Client-side logic in (app)/layout.tsx handles auth protection.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
