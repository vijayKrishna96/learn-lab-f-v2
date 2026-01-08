"use client";

import { X, Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "../styles/course-details.module.scss";

// Types
interface Lesson {
  title: string;
  duration: number;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface CategoryDetails {
  name: string;
}

interface InstructorDetails {
  name: string;
  email: string;
}

interface StudentDetails {
  id: string;
  name: string;
  email: string;
}

interface CourseImage {
  url: string;
}

interface Course {
  _id: string;
  title: string;
  image: CourseImage;
  modules: Module[];
  students: string[];
  price: number;
  averageRating?: number;
  categoryDetails: CategoryDetails;
  instructorDetails: InstructorDetails;
  studentDetails: StudentDetails[];
}

interface CoursesProps {
  courses: Course[];
}

const Courses: React.FC<CoursesProps> = ({ courses }) => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Extract unique category names and instructor names
  const categories = [
    ...new Set(courses.map((course) => course.categoryDetails.name)),
  ];
  const instructors = [
    ...new Set(courses.map((course) => course.instructorDetails.name)),
  ];

  useEffect(() => {
    let result = [...courses];

    if (selectedCategory !== "all") {
      result = result.filter(
        (course) => course.categoryDetails.name === selectedCategory
      );
    }

    if (selectedInstructor !== "all") {
      result = result.filter(
        (course) => course.instructorDetails.name === selectedInstructor
      );
    }

    setFilteredCourses(result);
  }, [selectedCategory, selectedInstructor, courses]);

  const getTotalLessons = (modules: Module[]): number => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  const handleViewDetailsClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className={styles.coursesContainer}>
      {/* Header with Filters */}
      <div className={styles.header}>
        <h1 className={styles.title}>All Courses</h1>

        <div className={styles.filtersWrapper}>
          <div className={styles.filterGroup}>
            <div className={styles.selectWrapper}>
              <Filter className={styles.filterIcon} />
              <select
                className={styles.select}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.selectWrapper}>
              <Filter className={styles.filterIcon} />
              <select
                className={styles.select}
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
              >
                <option value="all">All Instructors</option>
                {instructors.map((instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className={styles.courseGrid}>
        {filteredCourses.map((course) => (
          <div key={course._id} className={styles.courseCard}>
            <div className={styles.imageWrapper}>
              <img
                src={course.image.url}
                alt={course.title}
                className={styles.courseImage}
              />
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.courseTitle}>{course.title}</h3>

              <div className={styles.courseStats}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Modules</span>
                  <span className={styles.statValue}>{course.modules.length}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Lessons</span>
                  <span className={styles.statValue}>
                    {getTotalLessons(course.modules)}
                  </span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Students</span>
                  <span className={styles.statValue}>{course.students.length}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Price</span>
                  <span className={styles.statValue}>₹{course.price}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Rating</span>
                  <span className={styles.statValue}>
                    {course.averageRating || "N/A"}
                  </span>
                </div>
              </div>

              <button
                className={styles.viewButton}
                onClick={() => handleViewDetailsClick(course)}
              >
                View More Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column: Course and Student Details */}
            <div className={styles.leftColumn}>
              <h3 className={styles.modalTitle}>{selectedCourse.title}</h3>

              <div className={styles.courseDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Instructor</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.instructorDetails.name}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Instructor Email</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.instructorDetails.email}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Students</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.studentDetails.length}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Modules</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.modules.length}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Lessons</span>
                  <span className={styles.detailValue}>
                    {getTotalLessons(selectedCourse.modules)}
                  </span>
                </div>
              </div>

              <h4 className={styles.sectionTitle}>Student Details</h4>
              <div className={styles.studentList}>
                {selectedCourse.studentDetails.map((student) => (
                  <div key={student.id} className={styles.studentRow}>
                    <span className={styles.studentName}>{student.name}</span>
                    <span className={styles.studentEmail}>{student.email}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Module Details */}
            <div className={styles.rightColumn}>
              <div className={styles.moduleHeader}>
                <h4 className={styles.sectionTitle}>Module Details</h4>
                <button
                  className={styles.closeButton}
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  <X size={32} />
                </button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.moduleTable}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeaderLeft}>Module</th>
                      <th className={styles.tableHeaderRight}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.modules.map((module, moduleIndex) => (
                      <React.Fragment key={moduleIndex}>
                        {/* Module Header */}
                        <tr className={styles.moduleRow}>
                          <td colSpan={2} className={styles.moduleCell}>
                            {module.title} ({module.lessons.length} Lessons)
                          </td>
                        </tr>
                        {/* Module Lessons */}
                        {module.lessons.map((lesson, lessonIndex) => (
                          <tr
                            key={`${moduleIndex}-${lessonIndex}`}
                            className={styles.lessonRow}
                          >
                            <td className={styles.lessonTitle}>
                              {lesson.title}
                            </td>
                            <td className={styles.lessonDuration}>
                              {lesson.duration} min
                            </td>
                          </tr>
                        ))}
                        {/* Add space after each module */}
                        <tr>
                          <td colSpan={2} className={styles.moduleSpacing}></td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;