import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  const auth = verifyToken(req);
  if (!auth.success) return Response.json(auth, { status: 401 });

  await connectDB();
  const user = await User.findById(auth.decoded.userId).select("-password -otp -otpExpires");

  if (!user) {
    return Response.json({ success: false, message: "User not found" }, { status: 404 });
  }

  return Response.json({ success: true, data: user });
}


export async function PUT(req) {
  const auth = verifyToken(req);
  if (!auth.success) return Response.json(auth, { status: 401 });

  const body = await req.json();
  await connectDB();

  const updated = await User.findByIdAndUpdate(auth.decoded.userId, body, { new: true })
    .select("-password -otp -otpExpires");

  return Response.json({ success: true, message: "Profile updated", data: updated });
}