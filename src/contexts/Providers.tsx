"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store"; // Import persistor
import ThemeProvider from "./ThemeProvider";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";


interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="loading loading-infinity loading-lg"></div>
              <p className="mt-2">Loading...</p>
            </div>
          </div>
        } 
        persistor={persistor}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}