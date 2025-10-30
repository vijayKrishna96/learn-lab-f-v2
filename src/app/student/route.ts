import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/student/:path*", // optional: match all paths under /student
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optionally, decode token and check role
  const userRole = req.cookies.get("role")?.value;
  if (userRole !== "student") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
