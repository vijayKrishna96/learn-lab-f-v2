"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { verifyLogin } from "@/services/userApi";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/slices/userSlice";
import axios from "axios";
import { USER_DETAILS_API } from "@/utils/constants/api";
import Spinner from "@/components/spinner/Spinner";

interface PartialUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface FullUser extends PartialUser {
  bio: string;
  phone: string;
  headline: string;
  expertise: string;
  language: string;
  profilePicture: { url: string } | null;
}

type User = PartialUser | FullUser | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const dispatch = useDispatch();

  const fetchFullUserData = async (partialUser: PartialUser): Promise<FullUser | null> => {
    try {
      console.log("Fetching full user data for:", partialUser.id);
      const response = await axios.get(`${USER_DETAILS_API}/user/${partialUser.id}`, {
        withCredentials: true,
      });

      const fullUserData: FullUser = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      console.log("Full User Data fetched:", fullUserData);
      return fullUserData;
    } catch (err) {
      console.error("Failed to fetch full user data:", err);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      const verifyResponse = await verifyLogin();
      if (!verifyResponse?.loggedIn || !verifyResponse.user) {
        setUser(null);
        dispatch(setUserData(null));
        localStorage.removeItem("user");
        localStorage.removeItem("userFull");
        return;
      }

      const partialUser: PartialUser = verifyResponse.user;
      const fullUser = await fetchFullUserData(partialUser);
      
      if (fullUser) {
        setUser(fullUser);
        dispatch(setUserData(fullUser));
        localStorage.setItem("userFull", JSON.stringify(fullUser));
      } else {
        setUser(partialUser);
        dispatch(setUserData(partialUser));
      }
      localStorage.setItem("user", JSON.stringify(partialUser)); // Ensure partial is always fresh
    } catch (err) {
      console.error("Refresh user failed:", err);
      setUser(null);
      dispatch(setUserData(null));
      localStorage.removeItem("user");
      localStorage.removeItem("userFull");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // Load stored user for potential quick set, but we'll verify regardless
      let storedUser: PartialUser | null = null;
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        try {
          storedUser = JSON.parse(storedUserStr);
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("userFull");
        }
      }

      try {
        // Always verify the session via backend (ensures tokens are valid)
        const verifyResponse = await verifyLogin();
        if (!verifyResponse?.loggedIn || !verifyResponse.user) {
          // No valid session - clear any stale data
          if (storedUser) {
            localStorage.removeItem("user");
            localStorage.removeItem("userFull");
          }
          setUser(null);
          dispatch(setUserData(null));
          setLoading(false);
          setInitialLoad(false);
          return;
        }

        // Valid session - use verified data (fresh from token)
        const verifiedUser: PartialUser = verifyResponse.user;
        console.log("Verified partial user:", verifiedUser);

        // Update localStorage if stored doesn't match (e.g., different session)
        if (storedUser && storedUser.id !== verifiedUser.id) {
          localStorage.setItem("user", JSON.stringify(verifiedUser));
        }

        // Set verified user immediately (with potential name if in token)
        setUser(verifiedUser);
        dispatch(setUserData(verifiedUser));
        localStorage.setItem("user", JSON.stringify(verifiedUser)); // Always keep fresh

        setLoading(false);
        setInitialLoad(false);

        // Fetch full data in background (non-blocking)
        const fullUser = await fetchFullUserData(verifiedUser);
        if (fullUser) {
          setUser(fullUser);
          dispatch(setUserData(fullUser));
          localStorage.setItem("userFull", JSON.stringify(fullUser));
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        // Clear stale data on failure
        localStorage.removeItem("user");
        localStorage.removeItem("userFull");
        setUser(null);
        dispatch(setUserData(null));
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    initAuth();
  }, [dispatch]);

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes((user as PartialUser).role.toLowerCase());
  };

  // Only show loading spinner on initial app load, not on every navigation
  if (initialLoad && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size={64} className="text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, hasRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};