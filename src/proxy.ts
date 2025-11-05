// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const path = req.nextUrl.pathname;

  // public routes:
  if (
    path === "/" ||
    path.startsWith("/unauthorized") ||
    path.startsWith("/about") ||
    path.startsWith("/contact")
  ) {
    return NextResponse.next();
  }

  // need token from here onward
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  let role: string;
  try {
    const payload: any = jwtDecode(token);
    role = payload.role;
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // routes for STUDENT
  if (path.startsWith("/student")) {
    if (role !== "student") return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // routes for INSTRUCTOR
  if (path.startsWith("/instructor")) {
    if (role !== "instructor") return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // routes for ADMIN
  if (path.startsWith("/admin")) {
    if (role !== "admin") return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|.*\\..*).*)",
  ],
};
