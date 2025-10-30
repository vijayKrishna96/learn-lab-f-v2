import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import axios from "axios";

import { toast } from "react-toastify";
import { SIGNUP_API } from "@/utils/constants/api";

// ✅ Define props for the Signup component
interface SignupProps {
  isOpenn: boolean;
  onClosee: () => void;
  onSignupSuccess: () => void;
}

// ✅ Define the shape of the form data
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userRole?: "student" | "instructor";
}

const Signup: React.FC<SignupProps> = ({ isOpenn, onClosee, onSignupSuccess }) => {
  const [error, setError] = useState<string>("");
  const [passwordLengthError, setPasswordLengthError] = useState<boolean>(false);
  const [isToggled, setToggled] = useState<boolean>(false);

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRole: "student",
  });

  // ✅ Update userRole based on toggle
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      userRole: isToggled ? "instructor" : "student",
    }));
  }, [isToggled]);

  // ✅ Handle input changes with type safety
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, confirmPassword, name, email, userRole } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordLengthError(true);
      return;
    }

    try {
      const response = await axios.post(SIGNUP_API, {
        name,
        email,
        password,
        role: userRole,
      });

      if (response.data.success) {
        toast.success("Signup Successful");
        onSignupSuccess();
      }
    } catch (error: any) {
      toast.error("Signup Failed");
      console.error("Error sending data:", error.message);
    }
  };

  if (!isOpenn) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/10 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg relative w-96" id="Tags">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <div className="flex gap-2 items-center">
            <label className="User">{isToggled ? "Instructor" : "Student"}</label>
            <input
              type="checkbox"
              className="toggle border-dashed border-2 border-red-400"
              checked={isToggled}
              onChange={(e) => setToggled(e.target.checked)}
            />
          </div>
        </div>

        {/* Close Icon */}
        <IoCloseCircle
          className="absolute top-2 right-2 text-4xl cursor-pointer text-red-400"
          onClick={onClosee}
        />

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-left m-2">
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter name"
              className="form-input w-full p-2 border rounded m-2"
              id="Popup"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-left m-2">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-input w-full p-2 border rounded m-2"
              id="Popup"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-left m-2">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter Password"
              className="form-input w-full p-2 border rounded m-2"
              id="Popup"
              required
            />
            {passwordLengthError && (
              <p className="text-red-500 m-2">
                Password must be at least 8 characters long
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-left m-2">
              Confirm Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form-input w-full p-2 border rounded m-2"
              id="Popup"
              required
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primarybtn text-white py-2 px-4 rounded w-full m-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
