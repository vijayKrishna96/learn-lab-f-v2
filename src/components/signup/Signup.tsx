"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { SIGNUP_API } from "@/utils/constants/api";
import "../styles/theme.css";

interface SignupProps {
  isOpenn: boolean;
  onClosee: () => void;
  onSignupSuccess: () => void;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userRole?: "student" | "instructor";
}

const Signup: React.FC<SignupProps> = ({ isOpenn, onClosee, onSignupSuccess }) => {
  const [error, setError] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [isToggled, setToggled] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRole: "student",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userRole: isToggled ? "instructor" : "student",
    }));
  }, [isToggled]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, userRole } = formData;
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 8) return setPasswordLengthError(true);

    try {
      const res = await axios.post(SIGNUP_API, {
        name,
        email,
        password,
        role: userRole,
      });
      if (res.data.success) {
        toast.success("Signup successful!");
        onSignupSuccess();
      }
    } catch (err) {
      toast.error("Signup failed");
    }
  };

  if (!isOpenn) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <IoCloseCircle className="modal-close" onClick={onClosee} />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <div className="flex gap-2 items-center">
            <label>{isToggled ? "Instructor" : "Student"}</label>
            <input
              type="checkbox"
              checked={isToggled}
              onChange={(e) => setToggled(e.target.checked)}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Name"
            className="modal-input"
            required
          />
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
            className="modal-input"
            required
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Password"
            className="modal-input"
            required
          />
          {passwordLengthError && (
            <p className="text-red-500 text-sm">Password must be at least 8 characters</p>
          )}
          <input
            onChange={handleChange}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="modal-input"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="modal-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
