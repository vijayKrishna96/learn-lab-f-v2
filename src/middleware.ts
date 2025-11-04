// middleware.ts

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./server/utils/jwt"   // you already have jwt.ts

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const { pathname } = req.nextUrl

  if(!token) {
    // allow public pages only
    if(pathname.startsWith("/student") ||
       pathname.startsWith("/instructor") ||
       pathname.startsWith("/admin") ||
       pathname.startsWith("/(user)")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    return NextResponse.next()
  }

  const user = verifyToken(token)   // {role: 'student' | 'admin' | 'instructor'}

  // RBAC rules
  if(pathname.startsWith("/admin") && user.role !== "admin")
    return NextResponse.redirect(new URL("/unauthorized", req.url))

  if(pathname.startsWith("/student") && user.role !== "student")
    return NextResponse.redirect(new URL("/unauthorized", req.url))

  if(pathname.startsWith("/instructor") && user.role !== "instructor")
    return NextResponse.redirect(new URL("/unauthorized", req.url))

  return NextResponse.next()
}
