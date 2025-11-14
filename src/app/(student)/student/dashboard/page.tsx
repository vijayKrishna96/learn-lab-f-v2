"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import styles from "./page.module.scss";

import {
  ALL_CATEGORY_API,
  ALL_COURSE_API,
  USER_DETAILS_API,
} from "@/utils/constants/api";
import CourseCard from "@/components/coursecard/Card";

interface UserData {
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  // Add other course properties as needed
}

const Page: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]); // Use correct type if available
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false); // State to prevent hydration errors

  const dispatch = useDispatch();

  // Fetch categories - runs on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(ALL_CATEGORY_API);
        setCategories([{ _id: "all", name: "All" }, ...response.data]);
      } catch (error) {
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses based on selected category
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let url = ALL_COURSE_API;

        // Modify URL to filter by category
        url =
          selectedCategory === "all"
            ? url
            : `${url}?category=${selectedCategory}`;

        const response = await axios.get(url);
        setCourses(response.data);
      } catch (error) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCategory]);

  // Fetch instructors - runs on mount
  useEffect(() => {
    const getAllInstructors = async () => {
      try {
        const response = await axios.get(`${USER_DETAILS_API}/users`);
        setInstructors(response.data); // Assuming you need instructors data
      } catch (error) {
        console.log(error);
      }
    };
    getAllInstructors();
  }, []);

  // Fetch user data for personalized greeting
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${USER_DETAILS_API}/me`);
        setUserData(response.data);
      } catch (error) {
        console.log("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Avoid rendering dynamic data until the component has mounted
  if (!hasMounted) return null; // Skip SSR rendering until after the component has mounted

  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <>
      <div className={styles.dashboardContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <div className={styles.welcomeSection}>
              <img
                className={styles.profileImage}
                src="https://blog.ipleaders.in/wp-content/uploads/2021/05/online-course-blog-header.jpg"
                alt="Profile"
              />
              <div className={styles.welcomeContent}>
                {userData && (
                  <h3 className={styles.welcomeTitle}>
                    Welcome, {userData.name}
                  </h3>
                )}
              </div>
            </div>

            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search course"
                />
                <button className={styles.searchButton}>Search</button>
              </div>

              <div className={styles.heroContentWrapper}>
                <div className={styles.heroOverlay}>
                  <h1 className={styles.heroTitle}>Learning that gets you</h1>
                  <p className={styles.heroSubtitle}>
                    Skills for your present (and your future). <br /> Get
                    started with us.
                  </p>
                </div>

                <img
                  className={styles.heroImage}
                  src="https://s.udemycdn.com/browse_components/billboard/fallback_banner_image_udlite.jpg"
                  alt="Hero"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className={styles.coursesSection}>
          <div className={styles.coursesContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Online Courses</h2>
              <hr className={styles.sectionDivider} />
            </div>

            <div className={styles.categoriesSection}>
              <div className={styles.categoriesButtons}>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className={`${styles.categoryButton} ${
                      selectedCategory === category._id ? styles.active : ""
                    }`}
                    onClick={() => setSelectedCategory(category._id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.coursesGrid}>
              {loading ? (
                <div className={styles.loadingMessage}>Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className={styles.noCoursesMessage}>No courses found</div>
              ) : (
                courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Recommended Section */}
        <section className={styles.recommendedSection}>
          <div className={styles.recommendedContainer}>
            <h2 className={styles.recommendedTitle}>Recommended For You</h2>
            {/* Similar grid rendering can be added here */}
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
