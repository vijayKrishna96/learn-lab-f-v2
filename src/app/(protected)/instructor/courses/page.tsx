"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CiEdit } from "react-icons/ci";
import { SlEye } from "react-icons/sl";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
// import { selectUserCourses } from "../../features/userSlice";
// import {
//   ALL_COURSE_API,
//   ALL_COURSE_BY_USERID,
// } from "../../Utils/Constants/Api";
import styles from "./courses.module.scss";
import { RootState } from "@/redux/store";
import { ALL_COURSE_BY_USERID } from "@/utils/constants/api";

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
  // published: Course[];
  // draft: Course[];
  // archived: Course[];
  // MyLearnings: Course[];
}

type TabType = "all" | "published" | "draft" | "archived" | "MyLearnings";

const Page: React.FC = () => {
  const [tab, setTab] = useState<TabType>("all");
  const [courses, setCourses] = useState<CoursesState>({
    all: [],
    // published: [],
    // draft: [],
    // archived: [],
    // MyLearnings: [],
  });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [allCourses, setAllCourses] = useState<Course[]>([]);

  const userId = useSelector((state: RootState) => state.user.userData._id);

  // console.log("User Data in Courses Page:", user);

  useEffect(() => {
    const courseList = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${ALL_COURSE_BY_USERID}/${userId}`);
        console.log("Courses fetched for user:", response);
        setCourses({
          all: response?.data?.data || [],
          // published: response.data.published || [],
          // draft: response.data.draft || [],
          // archived: response.data.archived || [],
          // MyLearnings: myLearnings || [],
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

  useEffect(() => {
    const allCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${ALL_COURSE_API}`);
        setAllCourses(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    allCourses();
  }, []);

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return;
    try {
      await axios.delete(`${ALL_COURSE_API}/${selectedCourseId}`);
      setCourses((prev) => ({
        ...prev,
        [tab]: prev[tab].filter((course) => course._id !== selectedCourseId),
      }));
      setShowPopup(false);
      setSelectedCourseId(null);
    } catch (error) {
      console.log("Error deleting course:", error);
    }
  };

  const renderCourses = () => {
    
    return courses ? (
      courses.map((course) => (
        <div key={course._id} className={styles.courseCard}>
          <img
            src={course.image?.url}
            alt={course.title}
            className={styles.courseImage}
          />

          <Link href={`/instructor/${userId}/mycourse/edit/${course._id}`}>
            <button className={`${styles.actionButton} ${styles.editButton}`}>
              <CiEdit />
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
              <SlEye />
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
      <p>No Data available</p>
    );
  };

  const renderMyLearnings = () => {
    return myLearnings.length > 0 ? (
      <div className={styles.learningsGrid}>
        {myLearnings.map((course) => (
          <div key={course._id} className={styles.learningCard}>
            <img
              src={course.image.url}
              alt={course.title}
              className={styles.learningImage}
            />
            <div className={styles.learningContent}>
              <h4 className={styles.learningTitle}>{course.title}</h4>
              <p className={styles.learningDescription}>{course.description}</p>
              <hr className={styles.divider} />
              <div className={styles.learningFooter}>
                <Link href={`/instructor/${userId}/learning/${course._id}`}>
                  <button className={styles.continueButton}>
                    Continue Learning
                  </button>
                </Link>
                <p>Rating: {course.averageRating}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>
          Purchase a course and Start Learning
        </h2>
        <p className={styles.emptyText}>
          Explore our catalog and find the perfect course for you.
        </p>
      </div>
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
        <>
          {tab === "MyLearnings" ? (
            <div>{renderMyLearnings()}</div>
          ) : (
            <div className={styles.coursesGrid}>{renderCourses()}</div>
          )}
        </>
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