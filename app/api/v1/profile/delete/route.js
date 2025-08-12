import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { deleteFromS3, extractKeyFromUrl } from "@/lib/s3-utils";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const photoKeys = (user.photos || []).map(extractKeyFromUrl);
    await deleteFromS3(photoKeys);

    await User.findByIdAndDelete(userId);

    return new Response(
      JSON.stringify({ success: true, message: "User profile and photos deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
