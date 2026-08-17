import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "horizon-activity-dev-secret-change-me",
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("ha_session")?.value;
  if (!token) return NextResponse.next();

  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET);
    const role = String(payload.role ?? "");
    const path = request.nextUrl.pathname;

    if (role === "ADMIN" && !path.startsWith("/admin")) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.set("ha_session", "", { path: "/", maxAge: 0 });
      return res;
    }
  } catch {
    // invalid token — let it pass, page-level auth will handle it
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
