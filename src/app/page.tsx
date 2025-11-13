"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Book,
  Award,
  Lightbulb,
  Laptop,
  GraduationCap,
  Play,
  Search,
  NotebookText,
  Atom,
  FileCode,
  MonitorPlay,
  UserRoundCheck,
} from "lucide-react";
import { RootState } from "@/redux/store"; // Adjust path if needed
import styles from "./styles/home.module.scss";
import Link from "next/link";

import axios from "axios";

import {
  ALL_CATEGORY_API,
  ALL_COURSE_API,
  USER_DETAILS_API,
} from "@/utils/constants/api";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  image: {
    url: string;
  };
  [key: string]: any;
}

interface User {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typewriterText, setTypewriterText] = useState("");
  const fullText = "Learn new skills online on your time";
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Get theme from Redux store
  // const theme = useSelector((state: RootState) => state.theme.theme);
  // const [currentTheme, setCurrentTheme] = useState("light");

  // useEffect(() => {
  //   // Determine current theme (accounting for system preference)
  //   const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
  //     .matches
  //     ? "dark"
  //     : "light";
  //   const actualTheme = theme === "system" ? systemTheme : theme;
  //   setCurrentTheme(actualTheme);

  //   // Apply theme class to document
  //   document.documentElement.classList.toggle("dark", actualTheme === "dark");
  // }, [theme]);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypewriterText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  console.log(courses, "courses");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(ALL_CATEGORY_API);
        setCategories([{ _id: "all", name: "All" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get<{ users: User[] }>(
          `${USER_DETAILS_API}/users`
        );
        const filtered = response.data.users.filter(
          (u) => u.role === "instructor"
        );
        setInstructors(filtered);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const url =
          selectedCategory === "all"
            ? ALL_COURSE_API
            : `${ALL_COURSE_API}?category=${selectedCategory}`;
        const response = await axios.get<Course[]>(url);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCategory]);

  const floatingIcons = [
    {
      Icon: Book,
      color: "#4F46E5",
      position: { top: "1%", left: "1%" },
      delay: 0,
    },
    {
      Icon: Award,
      color: "#7C3AED",
      position: { top: "1%", right: "1%" },
      delay: 0.5,
    },
    {
      Icon: Lightbulb,
      color: "#F59E0B",
      position: { bottom: "1%", left: "1%" },
      delay: 1,
    },
    {
      Icon: Laptop,
      color: "#3B82F6",
      position: { bottom: "1%", right: "1%" },
      delay: 1.5,
    },
    {
      Icon: GraduationCap,
      color: "#10B981",
      position: { top: "1%", left: "25%" },
      delay: 2,
    },
  ];

  return (
    <>
      <div className={styles.heroSection}>
        {/* Decorative background elements */}
        <div className={styles.backgroundPattern}>
          <svg className={styles.patternSvg} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="#4F46E5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Gradient waves */}
        <div className={styles.gradientWave} />

        <div className={styles.heroContainer}>
          {/* Main Hero Grid */}
          <div className={styles.heroGrid}>
            {/* Left: Hero Text */}
            <div className={styles.heroText}>
              <h1 className={styles.heroHeading}>
                {typewriterText}
                <span className={styles.cursorBlink} />
              </h1>

              <p className={styles.heroSubtitle}>
                Learn from Industry Experts and Enhance Your Skills
              </p>

              <p className={styles.heroTagline}>
                Learn anything, anytime, anywhere
              </p>

              {/* CTA Buttons */}
              <div className={styles.ctaButtons}>
                <button className={styles.btnPrimary}>
                  Start Learning Now
                </button>
                <button className={styles.btnSecondary}>
                  <Play className={styles.iconPlay} fill="currentColor" />
                  Watch Demo
                </button>
              </div>

              {/* Search Bar */}
              <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to learn today?"
                    className={styles.searchInput}
                  />
                  <button className={styles.searchButton}>
                    <Search className={styles.iconSearch} />
                    Search
                  </button>
                </div>
              </div>

              {/* Tech Stack Icons */}
              <div className={styles.techStack}>
                <span className={styles.techLabel}>Popular skills:</span>
                <div className={styles.techIcons}>
                  <div className={`${styles.techIcon} ${styles.techJs}`}>
                    JS
                  </div>
                  <div className={`${styles.techIcon} ${styles.techReact}`}>
                    ⚛
                  </div>
                  <div className={`${styles.techIcon} ${styles.techTailwind}`}>
                    TW
                  </div>
                  <div className={`${styles.techIcon} ${styles.techPython}`}>
                    Py
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image with Floating Icons */}
            <div className={styles.heroImageSection}>
              {/* Spotlight glow */}
              <div className={styles.spotlightGlow} />

              {/* Main Hero Image */}
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <img
                    src="https://tonyburgess1969.files.wordpress.com/2017/09/aaeaaqaaaaaaaaimaaaajgy4ntizytiyltlhnjutndljzs05yjziltfmnjkwztjjn2mzoa.jpg?w=378"
                    alt="Learning Hero"
                    className={styles.heroImage}
                  />

                  {/* Floating Icons */}
                  {floatingIcons.map(
                    ({ Icon, color, position, delay }, index) => (
                      <button
                        key={index}
                        className={styles.floatingIcon}
                        style={{
                          ...position,
                          animationDelay: `${delay}s`,
                        }}
                      >
                        <div
                          className={styles.iconCircle}
                          style={{
                            backgroundColor: `${color}20`,
                            borderColor: color,
                          }}
                        >
                          <Icon className={styles.icon} style={{ color }} />
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Decorative circles */}
              <div className={`${styles.decoCircle} ${styles.decoCircle1}`} />
              <div className={`${styles.decoCircle} ${styles.decoCircle2}`} />
            </div>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar}>
            {[
              { number: "1200+", label: "Special Courses", icon: Laptop },
              {
                number: "12,500+",
                label: "Enrolled Students",
                icon: GraduationCap,
              },
              { number: "300+", label: "Expert Instructors", icon: Award },
            ].map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIconWrapper}>
                  <stat.icon className={styles.statIcon} />
                </div>
                <div className={styles.statContent}>
                  <h3 className={styles.statNumber}>{stat.number}</h3>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Courses Section */}
        <section className={styles.courses}>
          <h2>Most Selling Courses</h2>
          <div className={styles.categoryList}>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={
                  selectedCategory === cat._id ? styles.activeCat : styles.cat
                }
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <p className={styles.loading}>Loading...</p>
          ) : (
            <div className={styles.courseGrid}>
              {courses.map((course) => (
                <div key={course._id} className={styles.courseCard}>
                  <img src={course?.image?.url} alt={course.title} />
                  <h4>{course.title}</h4>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feedback */}
        <section className={styles.feedback}>
          <div className={styles.feedbackHeader}>
            <h2>Student Feedback</h2>
            <Link href="#" className={styles.viewAll}>
              View All
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
