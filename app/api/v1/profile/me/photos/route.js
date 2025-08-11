import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { uploadToS3 } from "@/lib/s3";
import User from "@/models/User";

export async function POST(req) {

  try {
    const auth = verifyToken(req);
    if (!auth.success) {
      return new Response(
        JSON.stringify(auth),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, message: "No file provided" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `profiles/${auth.decoded.userId}/${Date.now()}-${file.name}`;
    const fileUrl = await uploadToS3(buffer, fileName, file.type);

    const updatedUser = await User.findByIdAndUpdate(
      auth.decoded.userId,
      { $push: { photos: fileUrl } },
      { new: true }
    ).select("photos");

    return new Response(
      JSON.stringify({ success: true, photos: updatedUser.photos }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
