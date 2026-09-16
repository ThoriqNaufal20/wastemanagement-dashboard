import { NextRequest, NextResponse } from "next/server";

// Path yang bisa diakses TANPA login.
const PUBLIC_PATHS = ["/login", "/api/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const session = request.cookies.get("dashboard_session")?.value;

  if (session && session === process.env.DASHBOARD_SESSION_SECRET) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Exclude _next internals DAN semua file statis (apa pun yang ada
    // titik di nama filenya — .png, .jpg, .svg, .css, dst).
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
