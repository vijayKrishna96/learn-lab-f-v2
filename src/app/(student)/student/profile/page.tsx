'use client';

import React, { use, useEffect, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
// import { useNavigate, useParams } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
// import { LOGOUT_API, UPDATE_USER_DETAILS } from "../../Utils/Constants/Api";
import { useDispatch, useSelector } from "react-redux";
// import { setUserData } from "../../features/userSlice";
import style from './profile.module.scss'; // Import the SCSS file
import { UPDATE_USER_DETAILS } from "@/utils/constants/api";

interface UserData {
  name: string;
  email: string;
  phone: string;
  headline: string;
  bio: string;
  expertise: string;
  language: string;
  profilePicture: { url: string } | null;
}

function Page() {
  const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { userId } = useParams();
const userData = useSelector((state: any) => state.user.userData);

  console.log("User Data from Redux:", userData);
  
  const [formsData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    headline: "",
    bio: "",
    expertise: "",
    language: "English (US)",
    profilePicture: null,
  });

  const [imagePreview, setImagePreview] = useState<string>("https://via.placeholder.com/150");

//   useEffect(() => {
//     if (userData) {
//       setFormData({
//         name: userData.name || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         headline: userData.headline || "",
//         bio: userData.bio || "",
//         expertise: userData.expertise || "",
//         language: userData.language || "English (US)",
//         profilePicture: null,
//       });

//       if (userData.profilePicture?.url) {
//         setImagePreview(userData.profilePicture.url);
//       }
//     }
//   }, [userData]);

//   const handleLogout = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post(LOGOUT_API);
//       if (response?.data?.success) {
//         dispatch(setUserData({}));
//         localStorage.removeItem('token');
//         navigate("/");
//       }
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    //   setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formsData.name);
      formDataToSend.append("phone", formsData.phone);
      formDataToSend.append("headline", formsData.headline);
      formDataToSend.append("bio", formsData.bio);
      formDataToSend.append("expertise", formsData.expertise);
      formDataToSend.append("language", formsData.language);

      if (formsData.profilePicture) {
        formDataToSend.append("images", formsData.profilePicture);
      }

      const response = await axios.patch(
        `${UPDATE_USER_DETAILS}/${userId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.minHeightAuto}>
      {isLoading ? (
        <div className={style.loadingContainer}>
          <span className="loading loading-infinity loading-lg text-info"></span>
        </div>
      ) : (
        <div className={style.profileContainer}>
          <div className={style.header}>
            <h2 className={style.headerText}>Profile & Settings</h2>
            <label
              className={style.logoutButton}
            //   onClick={handleLogout}
            >
              Logout
              <span className={style.logoutIcon}>
                <BiLogOutCircle />
              </span>
            </label>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={style.formSection}>
              <div className={style.profileImageWrapper}>
                <div className={style.imageContainer}>
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className={style.profileImage}
                  />
                  <label
                    htmlFor="profilePicture"
                    className={style.imageUploadIcon}
                  >
                    <MdOutlineAddPhotoAlternate />
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    className={style.hiddenFileInput}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className={style.formGrid}>
                <div>
                  <label htmlFor="name" className={style.label}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formsData.name}
                    onChange={handleChange}
                    required
                    className={style.input}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={style.label}>Email</label>
                  <input
                    type="text"
                    name="email"
                    value={formsData.email}
                    readOnly
                    className={style.input}
                  />
                </div>
              </div>

              <div className={style.formGrid}>
                <div>
                  <label htmlFor="headline" className={style.label}>Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={formsData.headline}
                    onChange={handleChange}
                    className={style.input}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={style.label}>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formsData.phone}
                    onChange={handleChange}
                    className={style.input}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className={style.label}>Biography</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={formsData.bio}
                  onChange={handleChange}
                  className={style.textarea}
                ></textarea>
              </div>

              <div>
                <label htmlFor="language" className={style.label}>Language</label>
                <select
                  name="language"
                  value={formsData.language}
                  onChange={handleChange}
                  className={style.select}
                >
                  <option>English (US)</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>

            <div className={style.submitButtonWrapper}>
              <button
                type="submit"
                className={style.saveButton}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Page;
