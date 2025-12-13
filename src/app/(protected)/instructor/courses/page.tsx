"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
// import { CiEdit } from "react-icons/ci";
// import { SlEye } from "sl-react-icons";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import styles from "./courses.module.scss";
import { RootState } from "@/redux/store";
import { ALL_COURSE_BY_USERID } from "@/utils/constants/api";
import { EditIcon, EyeIcon } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
  };
  category: {
    name: string;
  };
  averageRating: number;
  price: number;
}

interface CoursesState {
  all: Course[];
}

type TabType = "all" | "published" | "draft" | "archived" | "MyLearnings";

const Page: React.FC = () => {
  const [tab, setTab] = useState<TabType>("all");
  const [courses, setCourses] = useState<CoursesState>({
    all: [],
  });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userId = useSelector((state: RootState) => state.user.userData._id);

  useEffect(() => {
    const courseList = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${ALL_COURSE_BY_USERID}/${userId}`);
        console.log("Courses fetched for user:", response);
        
        // Fix: Access response.data.data instead of response?.data?.data
        setCourses({
          all: response.data.data || [],
        });
      } catch (error) {
        console.log("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      courseList();
    }
  }, [userId]);

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return;
    try {
      await axios.delete(`${ALL_COURSE_BY_USERID}/${selectedCourseId}`);
      setCourses((prev) => ({
        ...prev,
        all: prev.all.filter((course) => course._id !== selectedCourseId),
      }));
      setShowPopup(false);
      setSelectedCourseId(null);
    } catch (error) {
      console.log("Error deleting course:", error);
    }
  };

  const renderCourses = () => {
    const currentCourses = courses.all;

    return currentCourses.length > 0 ? (
      currentCourses.map((course) => (
        <div key={course._id} className={styles.courseCard}>
          <img
            src={course.image?.url}
            alt={course.title}
            className={styles.courseImage}
          />

          <Link href={`/instructor/${userId}/mycourse/edit/${course._id}`}>
            <button className={`${styles.actionButton} ${styles.editButton}`}>
              <EditIcon />
            </button>
          </Link>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => {
              setShowPopup(true);
              setSelectedCourseId(course._id);
            }}
          >
            <MdOutlineDeleteOutline />
          </button>
          <Link href={`/instructor/${userId}/learning/${course._id}`}>
            <button className={`${styles.actionButton} ${styles.viewButton}`}>
              <EyeIcon />
            </button>
          </Link>
          <div className={styles.courseContent}>
            <h2 className={styles.courseCategory}>{course.category?.name}</h2>
            <h3 className={styles.courseTitle}>{course.title}</h3>
            <p className={styles.courseDescription}>{course.description}</p>
            <div className={styles.courseFooter}>
              <span>Rating: {course.averageRating}</span>
              <span>Price: ${course.price}</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No courses available</p>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Courses</h1>

      <div className={styles.tabContainer}>
        {(["all", "published", "draft", "archived", "MyLearnings"] as TabType[]).map(
          (type) => (
            <button
              key={type}
              className={`${styles.tabButton} ${
                tab === type ? styles.tabActive : ""
              }`}
              onClick={() => setTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        )}
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <span className={styles.loader}></span>
        </div>
      ) : (
        <div className={styles.coursesGrid}>{renderCourses()}</div>
      )}

      <Link
        className={styles.addButton}
        href={`/instructor/${userId}/mycourse/add`}
      >
        +
      </Link>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>
              Are you sure you want to delete this course?
            </h2>
            <div className={styles.popupActions}>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteCourse}
              >
                Yes
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;