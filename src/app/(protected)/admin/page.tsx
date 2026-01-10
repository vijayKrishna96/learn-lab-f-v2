"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  BookOpen,
  FileText,
  InboxIcon,
  Layout,
  LogOut,
} from "lucide-react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import axios from "axios";
// import {
//   ALL_COURSE_API,
//   LOGOUT_API,
//   USER_DETAILS_API,
// } from "../../Utils/Constants/Api";

// import Courses from "./CourseDetails";

import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

// import { setUserData } from "../../features/userSlice";
import styles from "./styles/Dashboard.module.scss";
import Courses from "./pages/CourseDetails";
import Students from "./pages/Students";
import Instructors from "./pages/Instructors";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import { ALL_COURSE_API } from "@/utils/constants/api";

interface Lesson {
  _id: string;
  title: string;
  duration?: number;
}

interface Module {
  _id: string;
  moduleNumber: number;
  title: string;
  lessons: Lesson[];
}

interface CourseImage {
  url: string;
  publicId: string;
}

interface InstructorDetails {
  _id: string;
  name: string;
  email: string;
  bio?: string;
}

interface CategoryDetails {
  _id: string;
  name: string;
  description: string;
}


interface Course {
 _id: string;
  id: string;
  title: string;
  description: string;
  image: CourseImage;
  price: number;
  modules: Module[];
  averageRating?: number;
  reviews: any[];
  category: CategoryDetails;
  categoryDetails: CategoryDetails;
  instructor: InstructorDetails;
  instructorDetails: InstructorDetails;
  level: string;
  language: string;
  enrollmentCount: number;
  totalDuration: number;
  isFree: boolean;
  status: string;
}

interface UserData {
  name: string;
  email: string;
  profilePicture?: {
    url: string;
  };
}

interface RootState {
  darkMode: {
    isDarkMode: boolean;
  };
}

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface InboxMessage {
  title: string;
  time: string;
  course: string;
}

const DashboardView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample data for the chart
  const chartData = [
    { month: 'Jan', sales: 4000, revenue: 2400, customers: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398, customers: 2210 },
    { month: 'Mar', sales: 2000, revenue: 9800, customers: 2290 },
    { month: 'Apr', sales: 2780, revenue: 3908, customers: 2000 },
    { month: 'May', sales: 1890, revenue: 4800, customers: 2181 },
    { month: 'Jun', sales: 2390, revenue: 3800, customers: 2500 },
    { month: 'Jul', sales: 3490, revenue: 4300, customers: 2100 },
  ];

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    if (day) {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      setSelectedDate(newDate);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      {/* Statistics Section */}
      <div className={styles.statsSection}>
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Product Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="customers" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.progressCalendarGrid}>
        {/* Progress Circle */}
        <div className={styles.progressCard}>
          <h3 className={styles.cardTitle}>Progress</h3>
          <div className={styles.progressCircleContainer}>
            <div className={styles.progressCircle}>
              <svg className={styles.progressSvg} viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeDasharray="30, 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className={styles.progressText}>
                <span className={styles.progressPercentage}>30%</span>
                <p className={styles.progressLabel}>SALES PROGRESS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <h3 className={styles.cardTitle}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <div className={styles.calendarNavigation}>
              <button onClick={previousMonth} className={styles.navButton}>
                ←
              </button>
              <button onClick={nextMonth} className={styles.navButton}>
                →
              </button>
            </div>
          </div>
          
          <div className={styles.calendarGrid}>
            {weekDays.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
            
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  ${styles.calendarDay}
                  ${!day ? styles.emptyDay : ''}
                  ${isToday(day) ? styles.today : ''}
                  ${isSelected(day) ? styles.selected : ''}
                `}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className={styles.selectedDate}>
            Selected: {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const InboxView: React.FC = () => {
  const messages: InboxMessage[] = [
    {
      title: "New Assignment Posted",
      time: "2 hours ago",
      course: "Physics",
    },
    {
      title: "Test Results Available",
      time: "1 day ago",
      course: "Chemistry",
    },
    { 
      title: "Course Update", 
      time: "2 days ago", 
      course: "Mathematics" 
    },
  ];

  return (
    <div className={styles.inboxView}>
      <h1 className={styles.inboxTitle}>Inbox</h1>
      <div className={styles.inboxCard}>
        {messages.map((message, index) => (
          <div key={index} className={styles.inboxMessage}>
            <div className={styles.messageContent}>
              <div>
                <h3 className={styles.messageTitle}>{message.title}</h3>
                <p className={styles.messageInfo}>
                  {message.course} • {message.time}
                </p>
              </div>
              <button className={styles.messageButton}>
                <ChevronRight className={styles.chevronIcon} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [userData, setUsersData] = useState<UserData | null>(null);
  const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const dispatch = useDispatch();

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result as string);
        setIsImageSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfilePicture = () => {
    setIsImageSelected(false);
    setFileInputKey(Date.now());
  };

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: Layout },
    { name: "Courses", icon: BookOpen },
    { name: "Students", icon: FileText },
    { name: "Instructors", icon: FileText },
    { name: "Inbox", icon: InboxIcon },
  ];

  useEffect(() => {
    const GetAllCourses = async () => {
      try {
        const response = await axios.get(ALL_COURSE_API);
        setCourseData(response?.data?.courses || []);
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    GetAllCourses();
  }, []);

  console.log("Course Data:", courseData);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${USER_DETAILS_API}/user/${userId}`);
        setUsersData(response?.data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const renderView = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardView />;
      case "Courses":
        return <Courses courses={courseData} />;
      case "Students":
        return <Students />;
      case "Instructors":
        return <Instructors />;
      case "Inbox":
        return <InboxView />;
      default:
        return <DashboardView />;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(LOGOUT_API);
      if (response?.data?.success) {
        localStorage.removeItem("token");
        dispatch(setUserData({}));
        router.push("/");
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Main Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>LearnLab</h1>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`${styles.navItem} ${
                activeTab === item.name ? styles.navItemActive : ""
              }`}
            >
              <item.icon className={styles.navIcon} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.headerTitle}>{activeTab}</h1>
            <div className={styles.headerActions}>
              <div >
                <DarkModeToggle/>
              </div>

              <button className={styles.notificationButton}>
                <Bell className={styles.bellIcon} />
              </button>
              <div className={styles.profileWrapper}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={styles.profileButton}
                >
                  <img
                    src={newProfilePicture || userData?.profilePicture?.url }
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <span className={styles.profileName}>{userData?.name}</span>
                </button>

                {/* Profile Sidebar */}
                {isProfileOpen && (
                  <div className={styles.profileDropdown}>
                    {/* Profile Info Section */}
                    <div className={styles.profileInfo}>
                      <img
                        src={newProfilePicture || userData?.profilePicture?.url || ""}
                        alt="Profile"
                        className={styles.profileDropdownImage}
                      />
                      <p className={styles.profileDropdownName}>{userData?.name}</p>
                      <p className={styles.profileDropdownEmail}>{userData?.email}</p>
                    </div>

                    {/* Profile Actions */}
                    <div className={styles.profileActions}>
                      <input
                        key={fileInputKey}
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={handleProfilePictureChange}
                        id="fileInput"
                      />
                      {!isImageSelected && (
                        <button
                          onClick={() => document.getElementById("fileInput")?.click()}
                          className={styles.chooseButton}
                        >
                          Choose New Picture
                        </button>
                      )}

                      {isImageSelected && (
                        <div className={styles.imageSelectedActions}>
                          <button
                            onClick={handleUpdateProfilePicture}
                            className={styles.updateButton}
                          >
                            Update Profile Picture
                          </button>
                          <button
                            onClick={() => setIsImageSelected(false)}
                            className={styles.chooseAnotherButton}
                          >
                            Choose Another Picture
                          </button>
                        </div>
                      )}
                    </div>

                    <button onClick={handleLogout} className={styles.logoutButton}>
                      <LogOut className={styles.logoutIcon} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={styles.contentArea}>{renderView()}</main>
      </div>
    </div>
  );
};

export default Page;