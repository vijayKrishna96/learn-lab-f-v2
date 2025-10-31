'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";

// export const metadata: Metadata = {
//   title: "My Learning Dashboard",
//   description: "A demo learning platform with multiple layouts",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  // Hide the Navbar for role-based routes
  const hideNavbar =
    pathname.startsWith("/student") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/instructor");

  return (
    <html lang="en">
      <body>
        {!hideNavbar && <Navbar />} 
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
