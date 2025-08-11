import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { sendOTP } from "@/lib/mailer";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const user = new User({ name, email, password: hashedPassword, otp, otpExpires });
    await user.save();

    await sendOTP(email, otp);

    return Response.json({ success: true, message: "Signup successful, OTP sent to email" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

