import React, { useEffect, useState } from "react";

// import { useParams } from "react-router-dom";
import axios from "axios";

import { useDispatch } from "react-redux";
// import { setUserData } from "../../features/userSlice";
import "./page.module.scss"; // Import the SCSS file
import { ALL_CATEGORY_API, ALL_COURSE_API, USER_DETAILS_API } from "@/utils/constants/api";

const Page = () => {
  const [userData, setUsersData] = useState(null);
  // const { userId } = useParams(); // Destructure userId from useParams
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors , setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(ALL_CATEGORY_API); // Replace with your categories API endpoint
        setCategories([{ _id: "all", name: "All" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let url = ALL_COURSE_API;
        url =
          selectedCategory === "all"
            ? url
            : `${url}?category=${selectedCategory}`;
        const response = await axios.get(url);
        // console.log(response, "cateww");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${USER_DETAILS_API}/user/${userId} `);
        // console.log("User details response:", response.data[0]);
        setUsersData(response.data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Handle the error 
      }
    };

    if (userId) {
      fetchUserDetails(); // Call the async function if userId is available
    }
  }, [userId]);

  useEffect(()=>{
    const getAllInstructors = async ()=>{
      try{
        const response = await axios.get(`${USER_DETAILS_API}/users`);
        const filteredInstructors = response.data.users.filter(user => user.role === 'instructor');
        setInstructors(filteredInstructors)
      }catch(error){
        console.log(error)
      }
    }
    getAllInstructors();
  },[])
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  console.log(userData , "data")
  dispatch(setUserData(userData))
  const userRole = userData?.role;


  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <img
              className="profile-image"
              src= {userData?.profilePicture?.url}
              alt=""
            />
            <div className="welcome-content">
              {userData && (
                <h3 className="welcome-title">
                  Welcome, {userData.name} {/* Use userData.name */}
                </h3>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search course"
              />
              <button className="search-button">
                Search
              </button>
            </div>

            {/* Image and Content */}
            <div className="hero-content-wrapper">
              <div className="hero-overlay">
                <h1 className="hero-title">
                  Learning that gets you
                </h1>
                <p className="hero-subtitle">
                  Skills for your present (and your future).
                  <br />
                  Get started with us.
                </p>
              </div>
              <img
                className="hero-image"
                src="https://s.udemycdn.com/browse_components/billboard/fallback_banner_image_udlite.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="courses-section">
        <div className="courses-container">
          {/* Header Section */}
          <div className="section-header">
            <h2 className="section-title">
              Our Online Courses
            </h2>
            <hr className="section-divider" />
          </div>

          {/* Buttons Section */}
          <div className="categories-section">
            <div className="categories-buttons">
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`category-button ${selectedCategory === category._id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category._id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Course Grid Section */}
            {loading ? (
              <div className="loading-message">Loading...</div>
            ) : (
              <div className="courses-grid">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      role={userRole}
                    />
                  ))
                ) : (
                  <p className="no-courses-message">
                    No courses available in this category
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="recommended-section">
        <div className="recommended-container">
          <h2 className="recommended-title">Recomended For You</h2>
          <div>
            {/* <AppleCardsCarouselDemo instructor = {instructors} /> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;