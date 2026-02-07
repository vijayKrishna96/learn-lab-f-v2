"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import styles from "./wishlist.module.scss";
import CourseCard from "@/components/coursecard/Card";
import { RootState } from "@/redux/store";
import { setUserData } from "@/redux/slices/userSlice";
import { setWishlistItems } from "@/redux/slices/wishlistSlice";
import { removeFromWishlistAPI } from "@/services/wishlistService";
import { removeWishlistItem } from "@/redux/slices/wishlistSlice";
import { WISHLIST_API } from "@/utils/constants/api";

interface Module {
  // Define the Module interface here if necessary
}

interface InstructorDetails {
  // Define the InstructorDetails interface here if necessary
}

interface Course {
  _id: string;
  userId: string;
  title: string;
  description: string;
  image: { url: string };
  modules: Module[];
  price: number;
  averageRating: number;
  instructorDetails?: InstructorDetails;
}

interface UserData {
  _id: string;
  name: string;
  wishlist: string[];
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData) as UserData | null;
  const userWishlist = useSelector((state: RootState) => state.user.userData?.wishlist || []);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items) as Course[];

  // Reusable fetch function
  const fetchAndPopulateWishlist = async () => {
    if (!userData?.wishlist || userData.wishlist.length === 0) {
      setLoading(false);
      dispatch(setWishlistItems([]));
      return;
    }

    try {
      const response = await axios.post(WISHLIST_API, {
        ids: userData.wishlist,
      });

      console.log(response.data, "Fetched courses");
      dispatch(setWishlistItems(response.data.courses || []));
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching wishlist courses:", err);
      setError(err.message || "Failed to load wishlist");
      setLoading(false);
    }
  };

  // Fetch and populate on mount if empty (handles refresh)
  useEffect(() => {
    if (wishlistItems.length > 0) {
      setLoading(false);
      return;
    }

    fetchAndPopulateWishlist();
  }, [userData?.wishlist?.length]); // Added dependency

  // Optional: Sync if userWishlist changes externally
  useEffect(() => {
    if (userWishlist.length !== wishlistItems.length) {
      const timer = setTimeout(() => {
        if (wishlistItems.length === 0 && userWishlist.length > 0) {
          fetchAndPopulateWishlist();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userWishlist.length, wishlistItems.length]);

  // Handle Remove from Wishlist
  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      // Call backend API to remove from wishlist
      await removeFromWishlistAPI(courseId);

      // Optimistically update Redux wishlist
      dispatch(removeWishlistItem(courseId));

      // Optimistically update userData.wishlist
      if (userData) {
        const updatedWishlist = userWishlist.filter(id => id !== courseId);
        dispatch(setUserData({ ...userData, wishlist: updatedWishlist }));
      }
    } catch (error: any) {
      console.error("Remove from Wishlist error:", error.response?.data || error.message);
      setError("Failed to remove item from Wishlist");
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Wishlist</h2>

        <p className={styles.subtitle}>
          {wishlistItems?.length} Course
          {wishlistItems?.length !== 1 ? "s" : ""} in wishlist
        </p>

        {wishlistItems.length === 0 ? (
          <p className={styles.emptyMessage}>Your wishlist is empty</p>
        ) : (
          <div className={styles.grid}>
            {wishlistItems?.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onRemove={handleRemoveFromWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}