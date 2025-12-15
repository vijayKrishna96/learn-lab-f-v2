"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MdDeleteSweep } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./course-form.module.scss";

interface Lesson {
  title: string;
  duration: string;
  image: File | null;
}

interface Module {
  moduleNumber: number;
  title: string;
  lessons: Lesson[];
}

interface Category {
  _id: string;
  name: string;
}

interface CourseData {
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: string;
  promoVideo?: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  requirements?: string;
  whatYouWillLearn?: string;
  tags?: string[];
  modules: Array<{
    moduleNumber: number;
    title: string;
    lessons: Array<{
      title: string;
      duration: string;
    }>;
  }>;
}

interface CourseFormProps {
  mode: "add" | "edit";
  userId: string;
  userName: string;
  ALL_CATEGORY_API: string;
  CREATE_COURSE_API: string;
  UPDATE_COURSE_API: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
  mode,
  userId,
  userName,
  ALL_CATEGORY_API,
  CREATE_COURSE_API,
  UPDATE_COURSE_API,
}) => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string | undefined;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState("");
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [promoVideo, setPromoVideo] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [language, setLanguage] = useState("English");
  const [requirements, setRequirements] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState("");
  const [tags, setTags] = useState("");
  const [modules, setModules] = useState<Module[]>([
    {
      moduleNumber: 1,
      title: "",
      lessons: [
        {
          title: "",
          duration: "",
          image: null,
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(ALL_CATEGORY_API);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [ALL_CATEGORY_API]);

  // Fetch course data if in edit mode
  useEffect(() => {
    const fetchCourseData = async () => {
      if (mode === "edit" && courseId) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${UPDATE_COURSE_API}/${courseId}`);
          const courseData: CourseData = response.data.course || response.data;

          setTitle(courseData.title || "");
          setDescription(courseData.description || "");
          setSelectedCategory(courseData.category || "");
          setPrice(courseData.price || "");
          setPromoVideo(courseData.promoVideo || "");
          setLevel(courseData.level || "beginner");
          setLanguage(courseData.language || "English");
          setRequirements(courseData.requirements || "");
          setWhatYouWillLearn(courseData.whatYouWillLearn || "");
          setTags(courseData.tags?.join(", ") || "");

          if (courseData.modules && courseData.modules.length > 0) {
            const formattedModules = courseData.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) => ({
                ...lesson,
                image: null,
              })),
            }));
            setModules(formattedModules);
          }
        } catch (error) {
          console.error("Error fetching course data:", error);
          toast.error("Failed to load course data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [mode, courseId, UPDATE_COURSE_API]);

  // Module handlers
  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        moduleNumber: modules.length + 1,
        title: "",
        lessons: [
          {
            title: "",
            duration: "",
            image: null,
          },
        ],
      },
    ]);
  };

  const handleDeleteModule = (moduleIndex: number) => {
    setModules(modules.filter((_, index) => index !== moduleIndex));
  };

  const handleModuleChange = (index: number, value: string) => {
    const newModules = [...modules];
    newModules[index].title = value;
    setModules(newModules);
  };

  // Lesson handlers
  const handleAddLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      title: "",
      duration: "",
      image: null,
    });
    setModules(newModules);
  };

  const handleDeleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(
      (_, index) => index !== lessonIndex
    );
    setModules(newModules);
  };

  const handleLessonChange = (
    moduleIndex: number,
    lessonIndex: number,
    field: "title" | "duration",
    value: string
  ) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(newModules);
  };

  const handleLessonImageChange = (
    moduleIndex: number,
    lessonIndex: number,
    file: File | null
  ) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex].image = file;
    setModules(newModules);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare modules data
      const modulesData = modules.map((module) => ({
        moduleNumber: module.moduleNumber,
        title: module.title,
        lessons: module.lessons.map((lesson) => ({
          title: lesson.title,
          duration: lesson.duration,
        })),
      }));

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      if (mode === "edit" && courseId) {
        // For editing: Send JSON data (without images for now)
        const updateData = {
          title,
          description,
          category: selectedCategory,
          price,
          instructor: userId,
          level,
          language,
          promoVideo: promoVideo || undefined,
          requirements: requirements || undefined,
          whatYouWillLearn: whatYouWillLearn || undefined,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
          modules: modulesData,
        };

        await axios.put(`${UPDATE_COURSE_API}/${courseId}`, updateData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Course updated successfully");
      } else {
        // For creating: Use FormData (with images)
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", selectedCategory);
        formData.append("price", price);
        formData.append("instructor", userId);
        formData.append("level", level);
        formData.append("language", language);

        // Optional fields
        if (promoVideo) formData.append("promoVideo", promoVideo);
        if (requirements) formData.append("requirements", requirements);
        if (whatYouWillLearn) formData.append("whatYouWillLearn", whatYouWillLearn);
        if (tagsArray.length > 0) {
          formData.append("tags", JSON.stringify(tagsArray));
        }

        // Add course image
        if (courseImage) {
          formData.append("images", courseImage);
        }

        // Add lesson images
        modules.forEach((module) => {
          module.lessons.forEach((lesson) => {
            if (lesson.image) {
              formData.append("images", lesson.image);
            }
          });
        });

        formData.append("modules", JSON.stringify(modulesData));

        await axios.post(CREATE_COURSE_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course created successfully");
      }
      
      router.back();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        `Error ${mode === "edit" ? "updating" : "creating"} course`;
      toast.error(errorMessage);
      console.error("Course submission error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode === "edit") {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        {mode === "edit" ? "Edit Course" : "Create a New Course"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          {/* Course Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Course Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Course Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Course Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.formGroupGrid}>
            {/* Category Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select
                className={styles.select}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Input */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Price ($) *</label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroupGrid}>
            {/* Level */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Level *</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className={styles.select}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Language */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Language *</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Instructor Info */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Instructor Name</label>
            <input
              type="text"
              value={userName}
              className={styles.inputDisabled}
              disabled
            />
          </div>

          {/* Promo Video URL */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Promo Video URL</label>
            <input
              type="url"
              value={promoVideo}
              onChange={(e) => setPromoVideo(e.target.value)}
              placeholder="https://youtube.com/..."
              className={styles.input}
            />
          </div>

          {/* Requirements */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Requirements</label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="What students need to know before taking this course"
              className={`${styles.textarea} ${styles.textareaSmall}`}
            />
          </div>

          {/* What You Will Learn */}
          <div className={styles.formGroup}>
            <label className={styles.label}>What You Will Learn</label>
            <textarea
              value={whatYouWillLearn}
              onChange={(e) => setWhatYouWillLearn(e.target.value)}
              placeholder="Key learning outcomes"
              className={`${styles.textarea} ${styles.textareaSmall}`}
            />
          </div>

          {/* Tags */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="javascript, web development, react"
              className={styles.input}
            />
          </div>

          {/* Course Image Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCourseImage(e.target.files?.[0] || null)}
              className={styles.fileInput}
            />
          </div>
        </div>

        {/* Modules and Lessons */}
        <h3 className={styles.modulesHeader}>Course Modules</h3>
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className={styles.moduleContainer}>
            <h3 className={styles.moduleHeader}>Module {module.moduleNumber}</h3>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => handleDeleteModule(moduleIndex)}
            >
              <MdDeleteSweep />
            </button>

            {/* Module Title */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Module Title *</label>
              <input
                type="text"
                value={module.title}
                onChange={(e) => handleModuleChange(moduleIndex, e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {/* Lessons */}
            {module.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className={styles.lessonContainer}>
                <h4 className={styles.lessonHeader}>Lesson {lessonIndex + 1}</h4>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDeleteLesson(moduleIndex, lessonIndex)}
                >
                  <MdDeleteSweep />
                </button>

                {/* Lesson Title */}
                <div className={styles.lessonFormGroup}>
                  <label className={styles.lessonLabel}>Lesson Title *</label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>

                {/* Lesson Duration */}
                <div className={styles.lessonFormGroup}>
                  <label className={styles.lessonLabel}>
                    Duration (e.g., "45 minutes") *
                  </label>
                  <input
                    type="text"
                    value={lesson.duration}
                    onChange={(e) =>
                      handleLessonChange(moduleIndex, lessonIndex, "duration", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>

                {/* Lesson Image Upload */}
                <div className={styles.lessonFormGroup}>
                  <label className={styles.lessonLabel}>Lesson Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleLessonImageChange(
                        moduleIndex,
                        lessonIndex,
                        e.target.files?.[0] || null
                      )
                    }
                    className={styles.fileInput}
                  />
                </div>
              </div>
            ))}

            {/* Add Lesson Button */}
            <button
              type="button"
              onClick={() => handleAddLesson(moduleIndex)}
              className={styles.addButton}
            >
              + Add Lesson
            </button>
          </div>
        ))}

        {/* Add Module Button */}
        <button
          type="button"
          onClick={handleAddModule}
          className={styles.addModuleButton}
        >
          + Add Module
        </button>

        {/* Submit Button */}
        <div className={styles.actionButtons}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading
              ? "Processing..."
              : mode === "edit"
              ? "Update Course"
              : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;