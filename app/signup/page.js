"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Too short",
    color: "bg-rose-500",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-rose-500" };
    else if (score === 2)
      return { score, label: "Fair", color: "bg-yellow-400" };
    else if (score === 3)
      return { score, label: "Good", color: "bg-green-400" };
    else if (score === 4)
      return { score, label: "Strong", color: "bg-green-600" };
    else return { score: 0, label: "Too short", color: "bg-rose-500" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Email already registered") {
          // Email registered: check if verified or not by attempting OTP modal
          // We assume API doesn't tell verified status, so try to resend OTP
          const resendRes = await fetch("/api/v1/auth/resend-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });
          const resendData = await resendRes.json();

          if (resendData.success) {
            toast.info(
              "Email already registered but not verified. Please verify OTP."
            );
            setShowOTPModal(true);
          } else if (resendData.message === "User already verified") {
            toast.info("User already verified. Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);
          } else {
            toast.error(resendData.message || "Error while resending OTP.");
          }
        } else {
          toast.error(data.message || "Signup failed.");
        }
        return;
      }

      toast.success("Signup successful! Please verify OTP.");
      setShowOTPModal(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Signup error:", error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch("/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Account verified!");
        setShowOTPModal(false);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || "Verification failed.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
      console.error("Verify error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      const res = await fetch("/api/v1/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
      console.error("Resend OTP error:", error);
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        pauseOnHover
        draggable
      />

      <form
        onSubmit={handleSubmit}
        className={`max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ${
          showOTPModal ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100 text-center">
          Create your account
        </h2>

        {/* Name */}
        <label className="block mb-5">
          <span className="text-gray-700 dark:text-gray-300">Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </label>

        {/* Email */}
        <label className="block mb-5">
          <span className="text-gray-700 dark:text-gray-300">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </label>

        {/* Password */}
        <label className="block mb-5">
          <span className="text-gray-700 dark:text-gray-300">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          <div className="w-full h-2 rounded-full mt-3 bg-gray-300 dark:bg-gray-600">
            <div
              className={`${passwordStrength.color} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
            />
          </div>
          <p className="text-sm mt-1 text-white">{passwordStrength.label}</p>
        </label>

        {/* Confirm Password */}
        <label className="block mb-7">
          <span className="text-gray-700 dark:text-gray-300">
            Confirm Password
          </span>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </label>

        {/* Signup button */}
        <button
          type="submit"
          className="w-full bg-[#6A5AE0] hover:bg-[#5644c0] cursor-pointer text-white font-semibold py-4 rounded-[24px] transition duration-300"
          disabled={showOTPModal}
        >
          Sign Up
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Login
          </a>
        </p>
      </form>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6 shadow-lg relative">
            {/* Close button */}
            <button
              onClick={() => setShowOTPModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
              aria-label="Close OTP modal"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
              Verify Your Account
            </h3>
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
              Enter the 6-digit OTP sent to <br />
              <span className="font-semibold">{formData.email}</span>
            </p>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-lg font-mono mb-6"
                placeholder="Enter OTP"
                autoFocus
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#6A5AE0] cursor-pointer hover:bg-[#5644c0] text-white font-semibold py-3 rounded-[24px] transition duration-300 mb-3"
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <button
              disabled={isResendingOtp}
              onClick={handleResendOtp}
              className="w-full bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-semibold py-3 rounded-[24px] transition duration-300"
            >
              {isResendingOtp ? "Resending OTP..." : "Resend OTP"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
