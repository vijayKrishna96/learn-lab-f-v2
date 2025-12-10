"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { CiLock } from "react-icons/ci";
import { TfiControlForward } from "react-icons/tfi";
// import { addItemToCart } from "../../features/cartSlice";
// import { selectUserCourses } from "../../features/userSlice";
import styles from "./course-page.module.scss";

interface Lesson {
  _id: string;
  title: string;
  duration?: number;
}

interface Module {
  _id: string;
  moduleNumber: number;
  title: string;
  lessons: Lesson[];
}

interface CourseImage {
  url: string;
}

interface CourseData {
  _id: string;
  title: string;
  description: string;
  image: CourseImage;
  price: number;
  modules: Module[];
  averageRating?: number;
  reviews: any[];
}

interface UserData {
  users: Array<{ role: string }>;
}

// const COURSE_BY_ID_API = process.env.NEXT_PUBLIC_COURSE_API || "/api/courses";
// const USER_DETAILS_API = process.env.NEXT_PUBLIC_USER_API || "/api/users";

const Page: React.FC = () => {
  // const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

    const { courseId } = useParams(); // ← correct method
    console.log(courseId)
  
  // const id = params?.id as string;
  // const userId = params?.userId as string;
  
//   const userCourses = useSelector(selectUserCourses) || [];
  
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
//   const isPurchased = courseData ? userCourses.includes(courseData._id) : false;

  // useEffect(() => {
  //   const fetchCourseData = async () => {
  //     try {
  //       const response = await axios.get<CourseData>(
  //         `${COURSE_BY_ID_API}/${id}`
  //       );
  //       setCourseData(response?.data);
  //     } catch (err) {
  //       console.error("Error fetching course:", err);
  //       setError("Failed to load course");
  //     }
  //   };
    
  //   if (id) {
  //     fetchCourseData();
  //   }
  // }, [id]);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get<UserData>(
//           `${USER_DETAILS_API}/${userId}`
//         );
//         setRole(response.data.users[0].role);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };
    
//     if (userId) {
//       fetchUserData();
//     }
//   }, [userId]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className={styles.loading}>
        <p>Loading course...</p>
      </div>
    );
  }

  const handleUnlockCourse = () => {
    if (courseData && userId && role) {
      dispatch(
        addItemToCart({ ...courseData, userId, qty: 1 })
      );
      router.push(`/${role}/cart/${userId}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>{courseData.title}</h1>
          <p className={styles.description}>{courseData.description}</p>
        </div>

        {/* Image Section */}
        <div className={styles.imageWrapper}>
          <img
            src={courseData.image?.url}
            alt={courseData.title}
            className={`${styles.courseImage} ${
              !isPurchased ? styles.blurred : ""
            }`}
          />
          
          {isPurchased ? (
            <div className={styles.overlay}>
              <Link href={`/${role}/${userId}/learning/${courseData._id}`}>
                <button className={styles.continueButton}>
                  Continue Learning
                  <TfiControlForward />
                </button>
              </Link>
            </div>
          ) : (
            <div className={styles.overlayLocked}>
              <CiLock size={48} className={styles.lockIcon} />
              <button
                className={styles.unlockButton}
                onClick={handleUnlockCourse}
              >
                Unlock and Start Learning
              </button>
            </div>
          )}
        </div>

        {/* Course Modules */}
        <div className={styles.modulesGrid}>
          {courseData.modules?.map((module) => (
            <div key={module._id} className={styles.moduleCard}>
              <h2 className={styles.moduleNumber}>
                {module.moduleNumber.toString().padStart(2, "0")}
              </h2>
              <h3 className={styles.moduleTitle}>{module.title}</h3>
              <ul className={styles.lessonList}>
                {module.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={lesson._id || lessonIndex}
                    className={styles.lessonItem}
                  >
                    <p className={styles.lessonTitle}>{lesson.title}</p>
                    <p className={styles.lessonMeta}>
                      Lesson {(lessonIndex + 1).toString().padStart(2, "0")} •{" "}
                      {lesson.duration || 45} Min
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Course Info Footer */}
        <div className={styles.footer}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Price</p>
              <p className={styles.infoValue}>
                ₹{courseData.price?.toLocaleString()}
              </p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Modules</p>
              <p className={styles.infoValue}>{courseData.modules?.length}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Rating</p>
              <p className={styles.infoValue}>
                {courseData.averageRating || "No ratings yet"}
              </p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Reviews</p>
              <p className={styles.infoValue}>{courseData.reviews?.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;