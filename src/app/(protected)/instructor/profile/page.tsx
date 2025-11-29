"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/redux/slices/userSlice";
import style from "./profile.module.scss";
import { UPDATE_USER_DETAILS } from "@/utils/constants/api";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { userLogout } from "@/services/userApi"; // Import the correct logout function
import { toast } from "react-toastify";
import Spinner from "@/components/spinner/Spinner";


interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  bio: string;
  expertise: string;
  language: string;
  profilePicture: string | null;
}

function Page() {
  const dispatch = useDispatch();
  const userData = useSelector(
    (state: RootState) => state.user.userData
  ) as UserData;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<
    UserData & { profilePicture: File | null }
  >({
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
  const [imagePreview, setImagePreview] = useState<string>(
    "https://via.placeholder.com/150"
  );

  const router = useRouter();

  // Guard: If no user data, show loading or redirect
  if (!userData?._id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size={64} className="text-green-600" />
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
      profilePicture: null,
    });

    if (userData.profilePicture) {
      setImagePreview(userData.profilePicture);
    }
  }, [userData]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log("🚪 Logging out...");

      // Call the proper logout API from userApi.ts
      // This will clear httpOnly cookies on the backend
      await userLogout();

      console.log("🚪 Logout API successful");

      // Clear Redux state
      dispatch(setUserData(null));

      // Show success message
      toast.success("Logged out successfully");

      console.log("🚪 Redirecting to home...");

      // Use window.location for hard redirect (clears all state)
      window.location.href = "/";

    } catch (error) {
      console.error("Logout error:", error);
      
      // Even if API fails, clear local state for safety
      dispatch(setUserData(null));
      localStorage.removeItem("user");
      localStorage.removeItem("userFull");
      
      toast.error("Logout failed, but local session cleared");
      
      // Still redirect
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("headline", formData.headline);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("expertise", formData.expertise);
      formDataToSend.append("language", formData.language);

      if (formData.profilePicture) {
        formDataToSend.append("images", formData.profilePicture);
      }

      const response = await axios.patch(
        `${UPDATE_USER_DETAILS}/${userData._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Important: Send cookies with request
        }
      );

      if (response.data) {
        // Update Redux with new data
        const updatedUserData = { ...userData, ...response.data };
        dispatch(setUserData(updatedUserData));
        
        // Update localStorage
        localStorage.setItem("userFull", JSON.stringify(updatedUserData));
        
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile. Please try again.");
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
            <button
              className={style.logoutButton}
              onClick={handleLogout}
              type="button"
            >
              Logout
              <span className={style.logoutIcon}>
                <BiLogOutCircle />
              </span>
            </button>
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
                  <label htmlFor="name" className={style.label}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={style.input}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={style.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    readOnly
                    className={style.input}
                  />
                </div>
              </div>

              <div className={style.formGrid}>
                <div>
                  <label htmlFor="headline" className={style.label}>
                    Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    id="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className={style.input}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={style.label}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={style.input}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className={style.label}>
                  Biography
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className={style.textarea}
                ></textarea>
              </div>

              <div>
                <label htmlFor="language" className={style.label}>
                  Language
                </label>
                <select
                  name="language"
                  id="language"
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
              <button type="submit" className={style.saveButton}>
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