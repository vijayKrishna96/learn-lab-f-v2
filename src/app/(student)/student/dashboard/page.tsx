"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";

import styles from "./page.module.scss";

import {
  ALL_CATEGORY_API,
  ALL_COURSE_API,
  USER_DETAILS_API,
} from "@/utils/constants/api";
import CourseCard from "@/components/coursecard/Card";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClock,
  FaHandshake,
  FaQuestionCircle,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUserData } from "../../../../redux/slices/userSlice";



interface UserData {
  _id: string;
  email: string;
  role: string;
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

interface Instructor {
  id: number;
  name: string;
  specialization: string;
  numOfStudents: number;
  photoUrl: string;
}

const mockEvents = [
  {
    id: "1",
    title: "Live Q&A Sessions: Mastering React Hooks",
    type: "Q&A",
    date: "November 20, 2025",
    time: "7:00 PM IST",
    description:
      "Join our experts for an interactive Q&A on advanced React concepts.",
    icon: FaQuestionCircle,
    isLive: false,
  },
  {
    id: "2",
    title: "Hands-on Workshop: Building Scalable APIs",
    type: "Workshop",
    date: "November 25, 2025",
    time: "10:00 AM IST",
    description:
      "Dive deep into API development with real-time coding exercises.",
    icon: FaChalkboardTeacher,
    isLive: true,
  },
  {
    id: "3",
    title: "Mentorship Session: Career Growth in Tech",
    type: "Mentorship",
    date: "November 28, 2025",
    time: "3:00 PM IST",
    description:
      "One-on-one guidance from industry leaders on your career path.",
    icon: FaHandshake,
    isLive: false,
  },
];

const instructors: Instructor[] = [
  {
    id: 1,
    name: "John Doe",
    specialization: "Mathematics",
    numOfStudents: 1200,
    photoUrl:
      "https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg", // Make sure to place an image in the public folder
  },
  {
    id: 2,
    name: "Jane Smith",
    specialization: "Computer Science",
    numOfStudents: 900,
    photoUrl:
      "https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg",
  },
  {
    id: 3,
    name: "Alice Johnson",
    specialization: "Physics",
    numOfStudents: 650,
    photoUrl:
      "https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg",
  },
  {
    id: 4,
    name: "Alice Johnson",
    specialization: "Physics",
    numOfStudents: 650,
    photoUrl:
      "https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg",
  },
];

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UpcomingEventsProps {
  // Add props as needed, e.g., events data from props
}

const Page: React.FC = () => {
  // const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  // const [instructors, setInstructors] = useState<any[]>([]); // Use correct type if available
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countdowns, setCountdowns] = useState<Record<string, Countdown>>({});
  const [hasMounted, setHasMounted] = useState(false); // State to prevent hydration errors

  const dispatch = useDispatch<AppDispatch>();

  // // ✅ useSelector must be at the top level
  // const user = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user: UserData = JSON.parse(stored);

    // ✅ 1️⃣ IMPORTANT: Dispatch localStorage data immediately
    // This prevents the Profile page from seeing empty state
    dispatch(setUserData(user));

    // 2️⃣ Fetch fresh user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${USER_DETAILS_API}/user/${user._id}`);

        // Normalize API response (object OR array → always object)
        const userData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        console.log("Normalized User Data:", userData);

        // 3️⃣ Update Redux with fresh data from API
        dispatch(
          setUserData({
            ...user, // Keep localStorage data as fallback
            ...userData, // Override with fresh API data
          })
        );
      } catch (error) {
        console.log("Failed to fetch user data", error);
        // Even if API fails, we still have localStorage data in Redux
      }
    };

    fetchUserData();
  } catch (err) {
    console.error("Failed to load user from localStorage", err);
  }
}, [dispatch]);

  
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
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get(`${USER_DETAILS_API}/user/${userId}`);
  //       console.log("User data response:", response.data);
  //       setUserData(response.data);
  //     } catch (error) {
  //       console.log("Failed to fetch user data");
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  // Function to calculate countdown
  const calculateCountdown = (
    eventDate: string,
    eventTime: string
  ): Countdown => {
    const [day, month, year] = eventDate.split(" ");
    const [hour, minute, period] = eventTime.split(":").map((s) => s.trim());
    let eventHour = parseInt(hour);
    if (period === "PM" && eventHour !== 12) eventHour += 12;
    if (period === "AM" && eventHour === 12) eventHour = 0;

    const eventDateTime = new Date(
      `${month} ${day}, ${year} ${eventHour}:${minute}:00 GMT+5:30`
    ); // IST offset
    const now = new Date();
    const diff = eventDateTime.getTime() - now.getTime();

    if (diff < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Event passed
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = mockEvents.reduce((acc, event) => {
        acc[event.id] = calculateCountdown(event.date, event.time);
        return acc;
      }, {} as Record<string, Countdown>);
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format countdown string
  const formatCountdown = (countdown: Countdown) => {
    if (
      countdown.days === 0 &&
      countdown.hours === 0 &&
      countdown.minutes === 0 &&
      countdown.seconds === 0
    ) {
      return "Event Started!";
    }
    return `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
  };

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
              {/* <div className={styles.welcomeContent}>
                {userData && (
                  <h3 className={styles.welcomeTitle}>
                    Welcome, {userData.name}
                  </h3>
                )}
              </div> */}
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
        <section className={styles.topInstructors}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top Instructors</h2>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.instructorsList}>
            {instructors.map((instructor) => (
              <div key={instructor.id} className={styles.instructorCard}>
                <div className={styles.instructorPhoto}>
                  <Image
                    src={instructor.photoUrl}
                    alt={instructor.name}
                    width={100}
                    height={100}
                    objectFit="cover"
                  />
                </div>
                <div className={styles.instructorInfo}>
                  <h3 className={styles.instructorName}>{instructor.name}</h3>
                  <p className={styles.instructorSpecialization}>
                    {instructor.specialization}
                  </p>
                  <p className={styles.numOfStudents}>
                    {instructor.numOfStudents} Students
                  </p>
                </div>
                <button className={styles.viewCoursesButton}>
                  View Courses
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className={styles.upcomingEventsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Upcoming Live Classes / Events
            </h2>
            <Link href="/student/events" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          <div className={styles.eventsGrid}>
            {mockEvents.map((event) => {
              const IconComponent = event.icon;
              const countdown = countdowns[event.id] || {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
              };
              const isPast =
                countdown.days === 0 &&
                countdown.hours === 0 &&
                countdown.minutes === 0 &&
                countdown.seconds === 0;

              return (
                <article key={event.id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <IconComponent className={styles.eventIcon} />
                    <span className={styles.eventType}>{event.type}</span>
                    {event.isLive && (
                      <span className={styles.liveBadge}>LIVE</span>
                    )}
                  </div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDescription}>{event.description}</p>
                  <div className={styles.eventMeta}>
                    <div className={styles.dateTime}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      <span>
                        {event.date} at {event.time}
                      </span>
                    </div>
                    <div className={styles.countdown}>
                      <FaClock className={styles.metaIcon} />
                      <span className={styles.countdownText}>
                        {formatCountdown(countdown)}
                      </span>
                    </div>
                    <button
                      className={`${styles.joinButton} ${
                        isPast ? styles.pastButton : ""
                      }`}
                      disabled={isPast}
                    >
                      {event.isLive || !isPast
                        ? event.isLive
                          ? "Join Now"
                          : "Register"
                        : "Ended"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
