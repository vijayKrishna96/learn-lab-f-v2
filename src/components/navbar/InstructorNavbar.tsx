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

const InstructorHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const pathname = usePathname(); // ✅ Example: /student/6714c06217f165436c5361ac

  // ✅ Extract userId from the pathname
  useEffect(() => {
    if (pathname) {
      const parts = pathname.split("/");
      const idFromPath = parts[parts.length - 1];
      setUserId(idFromPath);
    }
  }, [pathname]);

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
            <Link href={`/student/${userId}`}>
              <SiAlchemy />
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href={`/instructor/${userId}`}>Home</Link>
          </li>
          <li className="hidden md:block">
            <Link href={`/instructor/studentlist/${userId}`}>Student Directory</Link>
          </li>
          <li className="hidden md:block">
            <Link href={`/instructor/courses/${userId}`}>My Courses</Link>
          </li>
          <li className="hidden md:block">
            <Link href={`/student/mylearnings/${userId}`}>My Learnings</Link>
          </li>
        </ul>

        <div className="flex gap-4 md:gap-6 items-center">
          {/* ✅ Dark mode toggle */}
          <DarkModeToggle />

          {/* 🛒 Cart */}
          <div className="relative text-xl md:text-2xl">
            <Link href={`/student/cart/${userId}`}>
              <FaCartShopping />
            </Link>
            <span className="absolute -top-2 -right-2 text-xs bg-primarybtn text-white rounded-full w-5 h-5 flex items-center justify-center">
              {/* {userCart?.length ?? 0} */}
            </span>
          </div>

          {/* ❤️ Wishlist */}
          <div className="relative text-red-400 text-xl md:text-2xl">
            <Link href={`/student/wishlist/${userId}`}>
              <FaHeart />
            </Link>
            <span className="absolute -top-2 -right-2 text-xs bg-primarybtn text-white rounded-full w-5 h-5 flex items-center justify-center">
              {/* {userWishlist?.length ?? 0} */}
            </span>
          </div>

          {/* 👤 Profile */}
          <div className="hidden md:block">
            <Link href={`/instructor/profile/${userId}`}>
              <img
                src="https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
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
              <Link href={`/student/${userId}`} onClick={() => setIsSidebarOpen(false)}>
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
              <Link href={`/student/mylearnings/${userId}`} onClick={() => setIsSidebarOpen(false)}>
                My Learnings
              </Link>
            </li>
            <li>
              <Link href={`/student/aboutus/${userId}`} onClick={() => setIsSidebarOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link href={`/student/contact/${userId}`} onClick={() => setIsSidebarOpen(false)}>
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
