"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Next.js App Router version


import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { SiAlchemy } from "react-icons/si";
import { FaSortDown } from "react-icons/fa";

import DarkModeToggle from "@/components/ui/DarkModeToggle";
import "./style/Navbar.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const InstructorHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.userData);

  // ✅ Redux state
  // const cartItems = useSelector((state: any) => state.cart.cartItems);
  // const wishlistItems = useSelector((state: any) => state.wishlist.wishlistItems);
  // const userData = useSelector((state: any) => state.user.userData);

  // ✅ Filter user-specific items
  // const userCart = cartItems?.filter((item: any) => item.userId === userId);
  // const userWishlist = wishlistItems?.filter((item: any) => item.userId === userId);

  return (
    <nav className="shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-0">
        <ul className="navbar-links flex gap-8 items-center">
          <li className="navbar-logo text-3xl">
            <Link href={`/instructor/dashboard`}>
              <SiAlchemy />
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href={`/instructor/dashboard`}>Home</Link>
          </li>
          <li className="hidden md:block">
            <Link href={`/instructor/students`}>Student Directory</Link>
          </li>
          <li className="hidden md:block">
            <Link href={`/instructor/courses`}>My Courses</Link>
          </li>
          {/* <li className="hidden md:block">
            <Link href={`/student/mylearnings`}>My Learnings</Link>
          </li> */}
        </ul>

        <div className="flex gap-4 md:gap-6 items-center">
          {/* ✅ Dark mode toggle */}
          <DarkModeToggle />

          

          {/* 👤 Profile */}
          <div className="hidden md:block">
            <Link href={`/instructor/profile`}>
             
              <img
                src={user?.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            
            </Link>
          </div>

          {/* ☰ Mobile Menu */}
          <button className="md:hidden p-2 text-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
        </div>
      </div>

      {/* 📱 Sidebar for mobile */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-64 h-full sidebar shadow-lg p-4 z-50">
          <button onClick={() => setIsSidebarOpen(false)} className="text-xl absolute right-5">
            ✕
          </button>
          <ul className="flex flex-col mt-10 gap-8">
            <li>
              <Link href={`/student/dashboard`} onClick={() => setIsSidebarOpen(false)}>
                Home
              </Link>
            </li>
            <li onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="flex items-center gap-2 cursor-pointer">
                <span>Courses</span>
                <FaSortDown />
              </div>
              {dropdownOpen && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <Link href="#">Development</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href={`/student/mylearnings`} onClick={() => setIsSidebarOpen(false)}>
                My Learnings
              </Link>
            </li>
            <li>
              <Link href={`/student/aboutus`} onClick={() => setIsSidebarOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link href={`/student/contact`} onClick={() => setIsSidebarOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default InstructorHeader;
