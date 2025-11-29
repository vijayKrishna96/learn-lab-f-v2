"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import styles from "./wishlist.module.scss";
import CourseCard from "@/components/coursecard/Card";
import { RootState } from "@/redux/store";
import axios from "axios";

interface Course {
  _id: string;
  userId: string;
  title: string;
  // add whatever other fields exist
}

interface UserData {
  _id: string;
  name: string;
  wishlist: string[];
}

export default function Page() {
  const [courses , setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null);
  const params = useParams();

  const userData = useSelector(
      (state: RootState) => state.user.userData
    ) as UserData;

  console.log(userData, "userdata from redux")
  

  useEffect(() => {
      const fetchCourses = async () => {
        if (userData && userData.wishlist && userData.wishlist.length > 0) {
          setLoading(true); // Set loading to true before the request starts
          try {
            
            const response = await axios.post(
              "http://localhost:4500/courses/wishlist",
              {
                ids: userData.wishlist,
              }
            );
  
            console.log(response.data, "this is res");
  
            setCourses(response?.data?.courses); // Assuming the response is an array of courses
          } catch (err) {
            console.error("Error fetching courses:", err);
            setError(err.message || "Something went wrong!");
          } finally {
            setLoading(false); // Set loading to false when the request finishes
          }
        } else {
          // If no courses in the cart, stop loading and show an empty state
          setCourses([]);
          setLoading(false);
        }
      };
  
      fetchCourses(); // Fetch courses when component mounts or when `userData.cart` changes
    }, [userData.wishlist]);

  

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Wishlist</h2>

        <p className={styles.subtitle}>
          {courses?.length} Course
          {courses?.length > 1 ? "s" : ""} in wishlist
        </p>

        <div className={styles.grid}>
          {courses?.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
