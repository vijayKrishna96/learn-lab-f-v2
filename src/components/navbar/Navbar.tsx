"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SiAlchemy } from "react-icons/si";
import dynamic from "next/dynamic";
import Image from "next/image";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

import "./style/Navbar.css";

const LoginModal = dynamic(() => import("@/components/login/Login"), {
  ssr: false,
});
const SignupModal = dynamic(() => import("@/components/signup/Signup"), {
  ssr: false,
});

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const courseSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollToCourses = () => {
    if (courseSectionRef.current) {
      courseSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return (
      <nav className="shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4">
          <ul className="navbar-links flex gap-11 items-center">
            <li className="navbar-logo text-3xl text-primarybtn">
              <Link href="/">
                <SiAlchemy />
              </Link>
            </li>
            <li className="hidden md:block">
              <Link href="/">Home</Link>
            </li>
            <li className="hidden md:block">
              <button>Courses</button>
            </li>
            <li className="hidden md:block">
              <Link href="/about">About</Link>
            </li>
            <li className="hidden md:block">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>

          <div className="flex gap-5 items-center">
            <div className="w-10 h-10" />
            <button className="px-3 py-1">Signup</button>
            <button className="bg-primarybtn px-4 py-1 rounded-full">
              Login
            </button>
            <button className="md:hidden p-2">☰</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo & Links */}
        <ul className="navbar-links flex gap-11 items-center">
          <li className="navbar-logo text-3xl text-primarybtn">
            <Link href="/">
              <SiAlchemy />
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href="/">Home</Link>
          </li>
          <li className="hidden md:block">
            <button onClick={handleScrollToCourses}>Courses</button>
          </li>
          <li className="hidden md:block">
            <Link href="/about">About</Link>
          </li>
          <li className="hidden md:block">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex gap-5 items-center">
          <DarkModeToggle />

          <button className="px-3 py-1" onClick={() => setIsSignupOpen(true)}>
            Signup
          </button>
          <button
            className="bg-primarybtn px-4 py-1 rounded-full"
            onClick={() => setIsLoginOpen(true)}
          >
            Login
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-4 z-50 transition-all">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-xl absolute right-5"
          >
            X
          </button>
          <div className="mt-10 text-center">
            <Link
              href="/student/profile"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Image
                src="/default-profile.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full mx-auto"
              />
            </Link>
          </div>
          <ul className="flex flex-col mt-8 gap-10">
            <li>
              <Link href="/" onClick={() => setIsSidebarOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleScrollToCourses();
                  setIsSidebarOpen(false);
                }}
              >
                Courses
              </button>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsSidebarOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsSidebarOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </aside>
      )}

      {/* Modals */}
      {isSignupOpen && (
        <SignupModal
          isOpenn={isSignupOpen}
          onClosee={() => setIsSignupOpen(false)}
          onSignupSuccess={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;