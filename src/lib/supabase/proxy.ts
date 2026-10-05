import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/products', '/settings', '/stock-logs'];
const AUTH_ROUTES = ['/login', '/register'];

/**
 * Refreshes the Supabase auth cookie and enforces the route boundary.
 *
 * Must run in `proxy.ts` because Server Components cannot write cookies.
 * Reads claims (no network round-trip) and redirects based on the session.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // Do not run code between createServerClient and getClaims — it can trigger
  // a token refresh that races the cookie write above.
  // getClaims() verifies the JWT locally, so this costs no network round-trip.
  const { data } = await supabase.auth.getClaims();

  const isAuthenticated = Boolean(data?.claims?.sub);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}