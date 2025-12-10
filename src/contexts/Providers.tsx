"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store"; // Import persistor
import ThemeProvider from "./ThemeProvider";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import Spinner from "@/components/spinner/Spinner";
import ToastProvider from "@/components/toast-provider/ToastProvider";



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
              <Spinner size={64} className="text-blue-600" />
            </div>
          </div>
        } 
        persistor={persistor}
      >
        <ThemeProvider>
          <ToastProvider/>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}