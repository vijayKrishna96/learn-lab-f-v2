'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

export default function Template({
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
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}