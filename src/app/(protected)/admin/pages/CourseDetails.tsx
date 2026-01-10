"use client";

import { X, Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "../styles/course-details.module.scss";
import { BASE_URL_API } from "@/utils/constants/api";
import axios from "axios";

// Types
interface Lesson {
  title: string;
  duration: number;
}

interface Module {
  moduleNumber: number;
  title: string;
  lessons: Lesson[];
  _id: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Instructor {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
}

interface StudentDetails {
  id: string;
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  joined?: string;
}

interface CourseImage {
  url: string;
  publicId?: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  image: CourseImage;
  price: number;
  averageRating?: number;
  category: Category;
  instructor: Instructor | null;
}

interface CourseDetails extends Course {
  id: string;
  modules: Module[];
  students: StudentDetails[];
  level?: string;
  language?: string;
  isFree?: boolean;
  isPublished?: boolean;
  status?: string;
  enrollmentCount?: number;
  totalDuration?: number;
  completionPercentage?: number;
  whatYouWillLearn?: string[];
  requirements?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: string;
  publishedAt?: string | null;
}

interface CoursesProps {
  courses: Course[];
}

const Courses: React.FC<CoursesProps> = ({ courses }) => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  // Extract unique category names and instructor names
  const categories = [
    ...new Set(courses.map((course) => course.category.name)),
  ];
  const instructors = [
    ...new Set(
      courses
        .filter((course) => course.instructor !== null)
        .map((course) => course.instructor!.name)
    ),
  ];

  useEffect(() => {
    let result = [...courses];

    if (selectedCategory !== "all") {
      result = result.filter(
        (course) => course.category.name === selectedCategory
      );
    }

    if (selectedInstructor !== "all") {
      result = result.filter(
        (course) => course.instructor?.name === selectedInstructor
      );
    }

    setFilteredCourses(result);
  }, [selectedCategory, selectedInstructor, courses]);

  const getTotalLessons = (modules: Module[]): number => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  const getTotalDuration = (modules: Module[]): number => {
    return modules.reduce((total, module) => {
      const moduleDuration = module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
      return total + moduleDuration;
    }, 0);
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetailsClick = async (course: Course) => {
    setLoadingCourseId(course._id);
    try {
      const response = await axios.get(`${BASE_URL_API}/courses/${course._id}`);

      console.log('Fetch response:', response.data);
      
      if (!response.data || !response.data.success) {
        throw new Error('Failed to fetch course details');
      }
      
      // Access the course data from response.data.course
      setSelectedCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course details:', error);
      alert('Failed to load course details. Please try again.');
    } finally {
      setLoadingCourseId(null);
    }
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
                  <span className={styles.statLabel}>Category</span>
                  <span className={styles.statValue}>{course.category.name}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Instructor</span>
                  <span className={styles.statValue}>
                    {course.instructor?.name || "N/A"}
                  </span>
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
                disabled={loadingCourseId === course._id}
              >
                {loadingCourseId === course._id ? "Loading..." : "View More Details"}
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
              
              {selectedCourse.description && (
                <p className={styles.courseDescription}>{selectedCourse.description}</p>
              )}

              <div className={styles.courseDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Category</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.category.name}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Instructor</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.instructor?.name || "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Instructor Email</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.instructor?.email || "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Price</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.isFree ? "Free" : `₹${selectedCourse.price}`}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Level</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.level ? selectedCourse.level.charAt(0).toUpperCase() + selectedCourse.level.slice(1) : "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Language</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.language || "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.status ? selectedCourse.status.charAt(0).toUpperCase() + selectedCourse.status.slice(1) : "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Published</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.isPublished ? "Yes" : "No"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Students Enrolled</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.enrollmentCount || selectedCourse.students?.length || 0}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Total Modules</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.modules?.length || 0}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Total Lessons</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.modules ? getTotalLessons(selectedCourse.modules) : 0}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Total Duration</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.modules ? `${getTotalDuration(selectedCourse.modules)} min` : "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Average Rating</span>
                  <span className={styles.detailValue}>
                    {selectedCourse.averageRating ? `${selectedCourse.averageRating} / 5` : "No ratings yet"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Created</span>
                  <span className={styles.detailValue}>
                    {formatDate(selectedCourse.createdAt)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Last Updated</span>
                  <span className={styles.detailValue}>
                    {formatDate(selectedCourse.lastUpdated || selectedCourse.updatedAt)}
                  </span>
                </div>
              </div>

              <h4 className={styles.sectionTitle}>Enrolled Students</h4>
              <div className={styles.studentList}>
                {selectedCourse.students && selectedCourse.students.length > 0 ? (
                  selectedCourse.students.map((student) => (
                    <div key={student.id || student._id} className={styles.studentRow}>
                      <div className={styles.studentInfo}>
                        {student.profilePicture && (
                          <img 
                            src={student.profilePicture} 
                            alt={student.name}
                            className={styles.studentAvatar}
                          />
                        )}
                        <div>
                          <span className={styles.studentName}>{student.name}</span>
                          <span className={styles.studentEmail}>{student.email}</span>
                          {student.joined && (
                            <span className={styles.studentJoined}>
                              Joined: {formatDate(student.joined)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noData}>No students enrolled yet.</p>
                )}
              </div>
            </div>

            {/* Right Column: Module Details */}
            <div className={styles.rightColumn}>
              <div className={styles.moduleHeader}>
                <h4 className={styles.sectionTitle}>Course Curriculum</h4>
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
                      <th className={styles.tableHeaderLeft}>Module/Lesson</th>
                      <th className={styles.tableHeaderRight}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                      selectedCourse.modules.map((module, moduleIndex) => (
                        <React.Fragment key={module._id || moduleIndex}>
                          {/* Module Header */}
                          <tr className={styles.moduleRow}>
                            <td colSpan={2} className={styles.moduleCell}>
                              <strong>Module {module.moduleNumber}:</strong> {module.title.trim()} 
                              <span className={styles.lessonCount}>
                                ({module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''})
                              </span>
                            </td>
                          </tr>
                          {/* Module Lessons */}
                          {module.lessons.map((lesson, lessonIndex) => (
                            <tr
                              key={`${module._id}-${lessonIndex}`}
                              className={styles.lessonRow}
                            >
                              <td className={styles.lessonTitle}>
                                {lessonIndex + 1}. {lesson.title}
                              </td>
                              <td className={styles.lessonDuration}>
                                {lesson.duration} min
                              </td>
                            </tr>
                          ))}
                          {/* Add space after each module except the last one */}
                          {moduleIndex < selectedCourse.modules.length - 1 && (
                            <tr>
                              <td colSpan={2} className={styles.moduleSpacing}></td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className={styles.noData}>No modules available.</td>
                      </tr>
                    )}
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