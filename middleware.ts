import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/courses", "/files"];

export const middleware = async (request: NextRequest) => {
  const response = await updateSession(request);
  const sessionCookie = request.cookies
    .getAll()
    .find((cookie) => cookie.name.includes("sb-") && cookie.name.endsWith("auth-token"));

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtectedRoute && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
