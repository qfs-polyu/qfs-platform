import createMiddleware from 'next-intl/middleware';
import {createServerClient} from '@supabase/ssr';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from './i18n/routing';
import {SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY} from './lib/supabase/config';

const handleI18nRouting = createMiddleware(routing);

const ALLOWED_EMAIL_SUFFIXES = ['@polyu.edu.hk', '@connect.polyu.hk'];
const isSchoolEmail = (email: string) =>
  ALLOWED_EMAIL_SUFFIXES.some((s) => email.toLowerCase().endsWith(s));

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  // Refresh Supabase auth session cookies on every request.
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value}) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({name, value, options}) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: {user}
  } = await supabase.auth.getUser();

  // Guard the admin area until a member dashboard exists (M1+).
  if (
    request.nextUrl.pathname.includes('/admin') &&
    (!user || !isSchoolEmail(user.email ?? ''))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
