import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

/**
 * Authentication Middleware (Proxy)
 *
 * Performs optimistic auth checks on every route:
 * - Protects routes requiring authentication
 * - Redirects authenticated users away from auth pages
 * - Preserves original URL for post-login redirect
 *
 * NOTE: This performs OPTIMISTIC checks only (reads session from cookie).
 * For secure operations, always verify in your DAL or Server Actions.
 */

// 1. Specify protected and public routes
const protectedRoutes = ["/home"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie (optimistic check)
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    const loginUrl = new URL("/login", req.nextUrl);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Redirect to /home if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/home")
  ) {
    // Don't redirect from public landing page, only from auth pages
    if (path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Image files (.png, .svg, .jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.svg$).*)",
  ],
};
