import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    if (!user.isVerified) return Response.json({ success: false, message: "Account not verified" }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return Response.json({ success: false, message: "Invalid credentials" }, { status: 400 });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return Response.json({ success: true, message: "Login successful", token });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
