'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "next-themes";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/student") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/instructor");

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      {!hideNavbar && <Navbar />}
      {children}
    </ThemeProvider>
  );
}
