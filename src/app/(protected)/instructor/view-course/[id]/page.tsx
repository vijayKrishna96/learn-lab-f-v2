"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./view-course.module.scss";
import { BASE_URL_API } from "@/utils/constants/api";

interface Lesson {
  _id: string;
  title: string;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseData {
  title: string;
  description: string;
  modules: Module[];
}

const Page: React.FC = () => {
  const [data, setData] = useState<CourseData | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const params = useParams();
  const courseId = params?.id as string | undefined;

  const toggleModule = (index: number) => {
    setOpenModule(openModule === index ? null : index);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${BASE_URL_API}/courses/${courseId}`);
    
        // FIX: Access course object properly
        setData(response.data.course);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

  if (!data) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  const { title, description, modules } = data;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Side: Video Player */}
        <div className={styles.videoSection}>
          <video controls className={styles.videoPlayer}>
            <source src="your-video-source.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h2 className={styles.videoTitle}>{title}</h2>
          <p className={styles.videoDescription}>{description}</p>
        </div>

        {/* Right Side: Modules and Lessons */}
        <div className={styles.modulesSection}>
          <h3 className={styles.modulesHeading}>Lessons</h3>
          {modules?.map((module, index) => (
            <div key={module._id} className={styles.moduleWrapper}>
              <div
                className={styles.moduleHeader}
                onClick={() => toggleModule(index)}
              >
                <h4 className={styles.moduleTitle}>{module.title}</h4>
                <svg
                  className={`${styles.chevronIcon} ${
                    openModule === index ? styles.chevronOpen : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {openModule === index && (
                <div className={styles.lessonList}>
                  {module.lessons.map((lesson) => (
                    <div key={lesson._id} className={styles.lessonItem}>
                      <input
                        type="checkbox"
                        className={styles.lessonCheckbox}
                        checked={false}
                        readOnly
                      />
                      <span className={styles.lessonTitle}>
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
