import { NextRequest, NextResponse } from 'next/server';
import { localeMiddleware } from './i18n';

export async function middleware(request: NextRequest) {
  const locale = await localeMiddleware(request);

  const { pathname } = request.nextUrl;
  const localeInPath = ['ru', 'ro'].some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`);

  if (!localeInPath) {
    const newPath = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
