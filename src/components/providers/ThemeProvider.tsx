"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store"; // Adjust path if needed

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
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
    if (!mounted) return;
    const effectiveTheme = preferredTheme === "system" ? systemTheme : preferredTheme;
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [mounted, preferredTheme, systemTheme]);

  return <>{children}</>;
};

export default ThemeProvider;