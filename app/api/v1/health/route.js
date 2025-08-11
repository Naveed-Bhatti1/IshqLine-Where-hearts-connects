import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({
      success: true,
      message: "API is running and database connected",
      timestamp: new Date()
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: err.message
    }, { status: 500 });
  }
}
