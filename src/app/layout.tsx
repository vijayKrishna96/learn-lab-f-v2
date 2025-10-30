import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "My Learning Dashboard",
  description: "A demo learning platform with multiple layouts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
