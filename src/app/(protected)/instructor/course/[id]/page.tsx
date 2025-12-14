
import CourseForm from "@/components/course-form/CourseForm";
import { auth } from "@/lib/auth"; // Your auth method
import { redirect } from "next/navigation";

interface EditCoursePageProps {
  params: {
    id: string;
  };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
//   const session = await auth();
  
//   // Redirect to login if not authenticated
//   if (!session?.user) {
//     redirect("/login");
//   }

  return (
    <CourseForm
      mode="edit"
      courseId={params.id}
      userId={session.user.id || ""}
      userName={session.user.name || ""}
      ALL_CATEGORY_API={process.env.NEXT_PUBLIC_API_URL + "/api/categories"}
      UPDATE_COURSE_API={process.env.NEXT_PUBLIC_API_URL + "/api/courses"}
    />
  );
}