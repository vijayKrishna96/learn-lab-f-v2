"use client";

import CourseForm from "@/components/course-form/CourseForm";
import { RootState } from "@/redux/store";
import { ADD_NEW_COURSE, ALL_CATEGORY_API, UPDATE_COURSE_API } from "@/utils/constants/api";
import { useSelector } from "react-redux";

export default function AddCoursePage() {
  const user = useSelector((state: RootState) => state.user.userData);

  return (
    <CourseForm
      mode="add"
      userId={user?._id || ""}
      userName={user?.name || ""}
      ALL_CATEGORY_API={ALL_CATEGORY_API}
      CREATE_COURSE_API={ADD_NEW_COURSE}
      UPDATE_COURSE_API={UPDATE_COURSE_API}
    />
  );
}