"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdDeleteSweep } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

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
  courseId?: string;
  userId: string;
  userName: string;
  ALL_CATEGORY_API: string;
  UPDATE_COURSE_API: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
  mode,
  courseId,
  userId,
  userName,
  ALL_CATEGORY_API,
  UPDATE_COURSE_API,
}) => {
  const router = useRouter();

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
    if (tags) {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
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

    // Prepare modules data
    const modulesData = modules.map((module) => ({
      moduleNumber: module.moduleNumber,
      title: module.title,
      lessons: module.lessons.map((lesson) => ({
        title: lesson.title,
        duration: lesson.duration,
      })),
    }));

    formData.append("modules", JSON.stringify(modulesData));

    try {
      if (mode === "edit" && courseId) {
        await axios.put(`${UPDATE_COURSE_API}/${courseId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course updated successfully");
      } else {
        await axios.post(UPDATE_COURSE_API, formData, {
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
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg m-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg m-10">
      <h2 className="text-2xl font-bold mb-4">
        {mode === "edit" ? "Edit Course" : "Create a New Course"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {/* Course Title */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Course Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Category Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>
              <select
                className="mt-1 p-2 border w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Level */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Language *
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Instructor Info */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Instructor Name
            </label>
            <input
              type="text"
              value={userName}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100"
              disabled
            />
          </div>

          {/* Promo Video URL */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Promo Video URL
            </label>
            <input
              type="url"
              value={promoVideo}
              onChange={(e) => setPromoVideo(e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Requirements
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="What students need to know before taking this course"
              className="mt-1 p-2 w-full border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* What You Will Learn */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              What You Will Learn
            </label>
            <textarea
              value={whatYouWillLearn}
              onChange={(e) => setWhatYouWillLearn(e.target.value)}
              placeholder="Key learning outcomes"
              className="mt-1 p-2 w-full border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="javascript, web development, react"
              className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Course Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCourseImage(e.target.files?.[0] || null)}
              className="mt-1 p-2 w-full border rounded-lg"
            />
          </div>
        </div>

        {/* Modules and Lessons */}
        <h3 className="text-xl font-bold mb-4">Course Modules</h3>
        {modules.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            className="mb-6 border p-4 rounded-lg bg-gray-50 relative"
          >
            <h3 className="text-lg font-semibold mb-2">
              Module {module.moduleNumber}
            </h3>
            <button
              type="button"
              className="absolute top-4 right-4 text-2xl text-red-500 hover:text-red-700"
              onClick={() => handleDeleteModule(moduleIndex)}
            >
              <MdDeleteSweep />
            </button>

            {/* Module Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Module Title *
              </label>
              <input
                type="text"
                value={module.title}
                onChange={(e) => handleModuleChange(moduleIndex, e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Lessons */}
            {module.lessons.map((lesson, lessonIndex) => (
              <div
                key={lessonIndex}
                className="mb-4 p-4 border rounded-lg bg-white shadow-sm relative"
              >
                <h4 className="font-semibold mb-2">Lesson {lessonIndex + 1}</h4>
                <button
                  type="button"
                  className="absolute top-4 right-4 text-2xl text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteLesson(moduleIndex, lessonIndex)}
                >
                  <MdDeleteSweep />
                </button>

                {/* Lesson Title */}
                <div className="mb-2">
                  <label className="block text-gray-600 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)
                    }
                    className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Lesson Duration */}
                <div className="mb-2">
                  <label className="block text-gray-600 mb-1">
                    Duration (e.g., "45 minutes") *
                  </label>
                  <input
                    type="text"
                    value={lesson.duration}
                    onChange={(e) =>
                      handleLessonChange(moduleIndex, lessonIndex, "duration", e.target.value)
                    }
                    className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Lesson Image Upload */}
                <div className="mb-2">
                  <label className="block text-gray-600 mb-1">Lesson Image</label>
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
                    className="mt-1 p-2 w-full border rounded-lg"
                  />
                </div>
              </div>
            ))}

            {/* Add Lesson Button */}
            <button
              type="button"
              onClick={() => handleAddLesson(moduleIndex)}
              className="text-blue-500 hover:text-blue-700 mt-2 font-medium"
            >
              + Add Lesson
            </button>
          </div>
        ))}

        {/* Add Module Button */}
        <button
          type="button"
          onClick={handleAddModule}
          className="text-green-500 hover:text-green-700 mb-6 font-medium"
        >
          + Add Module
        </button>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
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
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;