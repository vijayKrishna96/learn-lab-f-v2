"use client";

import React, { useEffect, useState } from "react";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { IoMdSunny } from "react-icons/io";

const DarkModeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load saved theme from localStorage (once on mount)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="text-xl md:text-2xl p-2 rounded-full transform transition duration-300 hover:scale-105 hover:-translate-y-1"
    >
      {theme === "light" ? <BsFillMoonStarsFill /> : <IoMdSunny />}
    </button>
  );
};

export default DarkModeToggle;
