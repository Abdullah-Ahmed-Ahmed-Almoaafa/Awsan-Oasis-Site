import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session")?.value;
  const isLoggedIn = adminSession === "true";

  // إذا حاول الوصول إلى /admin أو أي مسار فرعي داخله ما عدا /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // إذا كان متصفحاً مسجلاً دخوله وحاول الذهاب لصفحة تسجيل الدخول /admin/login
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};