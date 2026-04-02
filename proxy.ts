import { NextRequest, NextResponse } from "next/server";
import { USER_COOKIE_KEY } from "@/constant/constant";

const ROLE_TAX_VOLUNTEER = "Tax Volunteer";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userCookieRaw = req.cookies.get(USER_COOKIE_KEY)?.value;

  if (!userCookieRaw) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/dashboard-tax-volunteers")
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let user;
  try {
    user = JSON.parse(userCookieRaw);
  } catch (e) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    const response = NextResponse.redirect(url);
    response.cookies.delete(USER_COOKIE_KEY);
    return response;
  }

  const userRole = user?.role?.name;
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    const url = req.nextUrl.clone();
    if (userRole === ROLE_TAX_VOLUNTEER) {
      url.pathname = "/dashboard-tax-volunteers";
    } else {
      url.pathname = "/dashboard";
    }
    return NextResponse.redirect(url);
  }

  if (
    userRole === ROLE_TAX_VOLUNTEER &&
    pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/dashboard-tax-volunteers")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard-tax-volunteers";
    return NextResponse.redirect(url);
  }

  if (
    userRole !== ROLE_TAX_VOLUNTEER &&
    pathname.startsWith("/dashboard-tax-volunteers")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard-tax-volunteers/:path*",
    "/auth/:path*",
  ],
};
