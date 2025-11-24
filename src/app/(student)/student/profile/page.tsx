'use client';

import React, { useEffect, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/redux/slices/userSlice"; // Uncomment if needed for update
import style from './profile.module.scss';
import { UPDATE_USER_DETAILS } from "@/utils/constants/api";
import { RootState } from "@/redux/store"; // Import for typing

interface UserData {
  _id: string; // Add this for full consistency
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
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData) as UserData;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserData & { profilePicture: File | null }>({
    _id: "",
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

  // Guard: If no user data, show loading or redirect (e.g., to login)
  if (!userData._id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-infinity loading-lg"></div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  console.log("User Data from Redux:", userData);

  useEffect(() => {
    // Populate form with existing data from Redux
    setFormData({
      _id: userData._id,
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      headline: userData.headline || "",
      bio: userData.bio || "",
      expertise: userData.expertise || "",
      language: userData.language || "English (US)",
      profilePicture: null, // Reset to null; use preview for display
    });

    if (userData.profilePicture?.url) {
      setImagePreview(userData.profilePicture.url);
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, profilePicture: file })); // Fixed: Attach file for submit
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name); // Fixed: Consistent naming
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("headline", formData.headline);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("expertise", formData.expertise);
      formDataToSend.append("language", formData.language);

      if (formData.profilePicture) {
        formDataToSend.append("images", formData.profilePicture);
      }

      const response = await axios.patch(
        `${UPDATE_USER_DETAILS}/${userData._id}`, // Fixed: Use userData._id
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        // Update Redux with new data (merge with response for full sync)
        const updatedUserData = { ...userData, ...response.data };
        dispatch(setUserData(updatedUserData));
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
                    value={formData.name}
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
                    value={formData.email}
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
                    value={formData.headline}
                    onChange={handleChange}
                    className={style.input}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={style.label}>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
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
                  value={formData.bio}
                  onChange={handleChange}
                  className={style.textarea}
                ></textarea>
              </div>

              <div>
                <label htmlFor="language" className={style.label}>Language</label>
                <select
                  name="language"
                  value={formData.language}
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
