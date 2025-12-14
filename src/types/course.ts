export interface Lesson {
  title: string;
  duration: string;
  image: File | null;
}

export interface Module {
  moduleNumber: number;
  title: string;
  lessons: Lesson[];
}

export interface Category {
  _id: string;
  name: string;
}

export interface CourseLesson {
  title: string;
  duration: string;
}

export interface CourseModule {
  moduleNumber: number;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseData {
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: string;
  instructor: string;
  promoVideo?: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  requirements?: string;
  whatYouWillLearn?: string;
  tags?: string[];
  modules: CourseModule[];
  createdAt?: string;
  updatedAt?: string;
}

export type CourseFormMode = "add" | "edit";