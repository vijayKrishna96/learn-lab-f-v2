"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "@/redux/slices/userSlice";
import { USER_DETAILS_API } from "@/utils/constants/api";
import { RootState } from "@/redux/store";

interface PartialUserData {
  _id: string;
  email: string;
  role: string;
}

interface FullUserData extends PartialUserData {
  name: string;
  bio: string;
  phone: string;
  headline: string;
  expertise: string;
  language: string;
  profilePicture: { url: string } | null;
  // Add other full fields as needed
}

type UserData = PartialUserData | FullUserData;

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData) as UserData;
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          setIsInitialized(true);
          return;
        }

        const partialUser: PartialUserData = JSON.parse(stored);

        // Skip API call if we already have full data in Redux (e.g., from PersistGate hydration)
        // if (userData.name && userData.bio) {
        //   console.log("Full user data already available in Redux - skipping fetch.");
        //   setIsInitialized(true);
        //   return;
        // }

        console.log("Fetching full user data...");

        // Fetch full user details from API
        const response = await axios.get(`${USER_DETAILS_API}/user/${partialUser._id}`);

        const fullUserData: FullUserData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        console.log("Normalized User Data:", fullUserData);

        // Update Redux (Redux Persist auto-saves)
        dispatch(setUserData(fullUserData));

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        // Clear invalid stored data to avoid repeated failures
        localStorage.removeItem("user");
        setIsInitialized(true);
      }
    };

    initializeUserData();
  }, []); // Run only once on mount

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-infinity loading-lg"></div>
          <p className="mt-2">Loading user data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}