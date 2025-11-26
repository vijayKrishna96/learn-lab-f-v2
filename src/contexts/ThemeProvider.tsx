// ✅ ThemeProvider.tsx (Your global theme handler)
"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const preferredTheme = useSelector((state: RootState) => state.theme.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateTheme = () => {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      const effectiveTheme = preferredTheme === "system" ? systemTheme : preferredTheme;

      // Apply to html element
      document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
      document.documentElement.setAttribute("data-theme", effectiveTheme);
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [mounted, preferredTheme]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ThemeProvider;