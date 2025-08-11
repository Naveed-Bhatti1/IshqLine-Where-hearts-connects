import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  const auth = verifyToken(req);
  if (!auth.success) {
    return Response.json(auth, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(auth.decoded.userId).select(
    "-password -otp -otpExpires"
  );

  if (!user) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return Response.json({ success: true, data: user });
}
