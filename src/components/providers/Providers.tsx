"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store"; // Adjust path if needed
import ThemeProvider from "./ThemeProvider";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}