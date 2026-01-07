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
// import Students from "./Students";
// import InstructorListTable from "./Instructors";
import ProductMetricsChart from "../../components/Instructor/Chart";
import axios from "axios";
import {
  ALL_COURSE_API,
  LOGOUT_API,
  USER_DETAILS_API,
} from "../../Utils/Constants/Api";
import Courses from "./CourseDetails";
import { useRouter, useParams } from "next/navigation";
import DarkMode from "../../components/ui/DarkMode";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../features/userSlice";
import styles from "./AdminDashboard.module.scss";

interface Course {
  id: string;
  title: string;
  // Add other course properties
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

const Page: React.FC = () => {
  const [value, setValue] = useState<Date>(new Date());
  const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  return (
    <>
      {/* Statistics Section */}
      <div className={styles.statsSection}>
        <div className={styles.chartCard}>
          <ProductMetricsChart />
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
                  strokeDasharray="10, 100"
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
          <h3 className={styles.cardTitle}>Calendar</h3>
          {/* Replace MUI DateCalendar with a custom calendar or another library */}
          <div className={styles.calendarPlaceholder}>
            <p>Custom Calendar Component Here</p>
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

const AdminDashboard: React.FC = () => {
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
        setCourseData(response?.data);
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    GetAllCourses();
  }, []);

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
        // return <Students />;
        return <div>Students Component (Coming Soon)</div>;
      case "Instructors":
        // return <InstructorListTable />;
        return <div>Instructors Component (Coming Soon)</div>;
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
              <div className={styles.darkModeWrapper}>
                <DarkMode />
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
                    src={newProfilePicture || userData?.profilePicture?.url || ""}
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