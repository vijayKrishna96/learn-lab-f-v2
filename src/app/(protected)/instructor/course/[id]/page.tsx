"use client";

import CourseForm from "@/components/course-form/CourseForm";
import { RootState } from "@/redux/store";
import { ALL_CATEGORY_API, ADD_NEW_COURSE, UPDATE_COURSE_API } from "@/utils/constants/api";
import { useSelector } from "react-redux";

export default function Page() {
  const user = useSelector((state: RootState) => state.user.userData);

  return (
    <CourseForm
      mode="edit"
      userId={user?._id || ""}
      userName={user?.name || ""}
      ALL_CATEGORY_API={ALL_CATEGORY_API}
      CREATE_COURSE_API={ADD_NEW_COURSE}
      UPDATE_COURSE_API={UPDATE_COURSE_API}
    />
  );
}