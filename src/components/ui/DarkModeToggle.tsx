"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/redux/slices/themeSlice";
import { RootState } from "@/redux/store";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { IoMdSunny } from "react-icons/io";

const DarkModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const preferredTheme = useSelector((state: RootState) => state.theme.theme);
  const [mounted, setMounted] = useState(false);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Apply theme class to document when theme changes
    const actualTheme = preferredTheme === "system" ? systemTheme : preferredTheme;
    document.documentElement.classList.toggle("dark", actualTheme === "dark");
  }, [preferredTheme, systemTheme]);

  if (!mounted) return <div className="w-10 h-10" />;

  const currentTheme = preferredTheme === "system" ? systemTheme : preferredTheme;

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    dispatch(setTheme(newTheme));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="text-xl md:text-2xl p-2 rounded-full transform transition duration-300 hover:scale-105 hover:-translate-y-1"
    >
      {currentTheme === "dark" ? <IoMdSunny /> : <BsFillMoonStarsFill />}
    </button>
  );
};

export default DarkModeToggle;