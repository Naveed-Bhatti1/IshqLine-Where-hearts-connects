import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security, return success even if email not found
      return new Response(
        JSON.stringify({
          success: true,
          message: "If this email exists, you will receive a reset link.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a reset token valid for 1 hour
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Construct reset URL (adjust domain accordingly)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Configure nodemailer (example using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email message
   const mailOptions = {
  from: `"IshqLine" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Password Reset Request",
  html: `
  <div style="
    font-family: 'Roboto', 'Noto Sans', sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 16px;
    background-color: #FFFFFF;
  ">
    <div style="
      background-color: #F8FAFC;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 4px 10px rgba(106, 90, 224, 0.1);
      text-align: center;
    ">
      <h2 style="
        color: #0F172A;
        font-weight: 500;
        font-size: 22px;
        line-height: 1.4;
        margin-bottom: 12px;
      ">Password Reset Request</h2>
      <p style="
        color: #475569;
        font-weight: 400;
        font-size: 16px;
        line-height: 1.5;
        margin: 0 0 20px;
      ">Hi there,</p>
      <p style="
        color: #475569;
        font-weight: 400;
        font-size: 16px;
        line-height: 1.5;
        margin: 0 0 24px;
      ">
        You requested to reset your password. Please click the button below to reset it. This link will expire in <strong>1 hour</strong>.
      </p>
      <a href="${resetUrl}" style="
        display: inline-block;
        background-color: #6A5AE0;
        color: white;
        font-weight: 500;
        font-size: 16px;
        padding: 12px 28px;
        border-radius: 24px;
        text-decoration: none;
        box-shadow: 0 4px 10px rgba(106, 90, 224, 0.3);
        user-select: none;
        margin: 16px 0 24px;
      ">Reset Password</a>
      <p style="
        color: #475569;
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
      ">
        If you did not request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #E0E7FF; margin: 32px 0;">
      <p style="
        color: #475569;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.4;
        margin: 0;
      ">
        &copy; ${new Date().getFullYear()} IshqLine. All rights reserved.
      </p>
    </div>
  </div>
  `,
};

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: "If this email exists, you will receive a reset link.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Password reset request error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
