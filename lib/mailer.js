import nodemailer from "nodemailer";

export async function sendOTP(email, otp) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
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
      ">Your IshqLine OTP Code</h2>
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
      ">Your one-time password (OTP) for IshqLine is:</p>
      <div style="
        display: inline-block;
        font-size: 28px;
        font-weight: 500;
        color: #6A5AE0;
        letter-spacing: 6px;
        padding: 12px 24px;
        border-radius: 20px;
        background-color: #FFFFFF;
        box-shadow: 0 2px 6px rgba(255, 90, 122, 0.3);
        user-select: all;
      ">
        ${otp}
      </div>
      <p style="
        color: #475569;
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5;
        margin: 24px 0 0;
      ">This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
      <hr style="border: none; border-top: 1px solid #E0E7FF; margin: 32px 0;">
      <p style="
        color: #475569;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.4;
        margin: 0;
      ">
        If you did not request this code, please ignore this email.<br>
        &copy; ${new Date().getFullYear()} IshqLine. All rights reserved.
      </p>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"IshqLine" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your IshqLine OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: htmlContent,
  });
}
