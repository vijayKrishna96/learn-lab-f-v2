"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { CiLock } from "react-icons/ci";
import { TfiControlForward } from "react-icons/tfi";
// import { addItemToCart } from "../../features/cartSlice";
import styles from "./course-page.module.scss";
import { COURSE_BY_ID_API } from "@/utils/constants/api";
import { selectPurchasedCourses } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

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
  publicId: string;
}

interface InstructorDetails {
  _id: string;
  name: string;
  email: string;
  bio?: string;
}

interface CategoryDetails {
  _id: string;
  name: string;
  description: string;
}

interface CourseData {
  _id: string;
  id: string;
  title: string;
  description: string;
  image: CourseImage;
  price: number;
  modules: Module[];
  averageRating?: number;
  reviews: any[];
  category: string;
  categoryDetails: CategoryDetails;
  instructor: string;
  instructorDetails: InstructorDetails;
  level: string;
  language: string;
  enrollmentCount: number;
  totalDuration: number;
  isFree: boolean;
  status: string;
}

interface ApiResponse {
  success: boolean;
  course: CourseData;
}

const Page: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  
  const userCourses = useSelector(selectPurchasedCourses) || [];

  console.log(userCourses)
  
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const user = useSelector((state: RootState) => state.user.userData);
  // const [role, setRole] = useState<string | null>(null);
  // const [userId, setUserId] = useState<string | null>(null);
  
  // Check if course is purchased - if courseId is in userCourses array, it's purchased
  const isPurchased = userCourses.some(
  (item) => item.course === courseData?._id || item.course === courseData?.id
);


  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${COURSE_BY_ID_API}/${courseId}`
        );
        // Extract course from the response object
        setCourseData(response.data.course);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      }
    };
    
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (courseData && user._id && user.role) {
      // Uncomment when addItemToCart is imported
      // dispatch(addItemToCart({ ...courseData, userId, qty: 1 }));
      router.push(`/${user.role}/cart`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>{courseData.title}</h1>
          <p className={styles.description}>{courseData.description}</p>
          
          {/* Additional Info */}
          <div className={styles.headerMeta}>
            <span className={styles.metaItem}>
              <strong>Category:</strong> {courseData.categoryDetails?.name}
            </span>
            <span className={styles.metaItem}>
              <strong>Instructor:</strong> {courseData.instructorDetails?.name}
            </span>
            <span className={styles.metaItem}>
              <strong>Level:</strong> {courseData.level}
            </span>
            <span className={styles.metaItem}>
              <strong>Language:</strong> {courseData.language}
            </span>
          </div>
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
              <Link href={`/${user.role}/learning/${courseData._id}`}>
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
                {courseData.isFree ? "Enroll for Free" : "Unlock and Start Learning"}
              </button>
            </div>
          )}
        </div>

        {/* Course Modules */}
        <div className={styles.modulesSection}>
          <h2 className={styles.sectionTitle}>Course Curriculum</h2>
          <div className={styles.modulesGrid}>
            {courseData.modules?.map((module) => (
              <div key={module._id} className={styles.moduleCard}>
                <h2 className={styles.moduleNumber}>
                  Module {module.moduleNumber.toString().padStart(2, "0")}
                </h2>
                <h3 className={styles.moduleTitle}>{module.title}</h3>
                <ul className={styles.lessonList}>
                  {module.lessons?.map((lesson, lessonIndex) => (
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
        </div>

        {/* Course Info Footer */}
        <div className={styles.footer}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Price</p>
              <p className={styles.infoValue}>
                {courseData.isFree 
                  ? "Free" 
                  : `₹${courseData.price?.toLocaleString()}`
                }
              </p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Modules</p>
              <p className={styles.infoValue}>{courseData.modules?.length || 0}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Rating</p>
              <p className={styles.infoValue}>
                {courseData.averageRating 
                  ? `${courseData.averageRating.toFixed(1)} ⭐` 
                  : "No ratings yet"}
              </p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Reviews</p>
              <p className={styles.infoValue}>{courseData.reviews?.length || 0}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Enrolled</p>
              <p className={styles.infoValue}>{courseData.enrollmentCount || 0}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Duration</p>
              <p className={styles.infoValue}>
                {courseData.totalDuration 
                  ? `${Math.floor(courseData.totalDuration / 60)}h ${courseData.totalDuration % 60}m`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;