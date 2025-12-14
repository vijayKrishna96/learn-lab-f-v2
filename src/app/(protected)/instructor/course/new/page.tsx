'use client';
import CourseForm from "@/components/course-form/CourseForm";
import { auth } from "@/lib/auth"; // Your auth method
import { RootState } from "@/redux/store";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default async function NewCoursePage() {
//   const session = await auth();
  
//   // Redirect to login if not authenticated
//   if (!session?.user) {
//     redirect("/login");
//   }

const user = useSelector((state: RootState) => state.user.userData);

  return (
    <CourseForm
      mode="add"
      userId={user._id || ""}
      userName={user.name || ""}
      ALL_CATEGORY_API={process.env.NEXT_PUBLIC_API_URL + "/api/categories"}
      UPDATE_COURSE_API={process.env.NEXT_PUBLIC_API_URL + "/api/courses"}
    />
  );
}