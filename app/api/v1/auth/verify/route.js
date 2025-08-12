import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Email and OTP are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (user.isVerified) {
      return new Response(
        JSON.stringify({ success: false, message: "User already verified" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (user.otp !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (Date.now() > user.otpExpiry) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP expired" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Account verified successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
