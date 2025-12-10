'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ALL_COURSE_BY_USERID, BASE_URL_API } from '@/utils/constants/api';
import styles from './my-learnings.module.scss';
import { useSelector } from 'react-redux';
import { selectPurchasedCourses } from '@/redux/slices/userSlice';

interface CourseImage {
  url: string;
}

interface Course {
  _id: string;
  image: CourseImage;
  title: string;
  description: string;
  averageRating: number;
}

const Page: React.FC = () => {
  const params = useParams();
  const userId = params?.userId as string;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const courseIDs = useSelector(selectPurchasedCourses);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axios.post(`${BASE_URL_API}/courses/by-ids`, {
        ids: courseIDs,       
      });
      console.log(response, "resss")
      setCourses(response.data.courses);   
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (courseIDs?.length > 0) {  // Only fetch if IDs exist
    fetchCourses();
  }
}, [courseIDs]);   // 🔥 run when purchased course IDs change


  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
      <h1 className={styles.title}>Learnings</h1>

      {loading ? (
        <div className={styles.loadingState}>
          <p>Loading your courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyStateTitle}>
            Purchase a course and Start Learning
          </h2>
          <p className={styles.emptyStateText}>
            Explore our catalog and find the perfect course for you.
          </p>
        </div>
      ) : (
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <div key={course._id} className={styles.courseCard}>
              <img
                src={course.image.url}
                alt={course.title}
                className={styles.courseImage}
              />
              <div className={styles.courseContent}>
                <h4 className={styles.courseTitle}>{course.title}</h4>
                <p className={styles.courseDescription}>{course.description}</p>
                <hr className={styles.divider} />

                <div className={styles.courseFooter}>
                  <Link href={`/student/${userId}/learning/${course._id}`}>
                    <button className={styles.continueButton}>
                      Continue Learning
                    </button>
                  </Link>
                  <p className={styles.rating}>Rating: {course.averageRating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Page;