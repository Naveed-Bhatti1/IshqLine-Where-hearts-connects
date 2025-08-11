import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.isVerified) return Response.json({ success: true, message: "Already verified" });

    if (user.otp !== otp || new Date() > user.otpExpires) {
      return Response.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return Response.json({ success: true, message: "Account verified successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
