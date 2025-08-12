import jwt from "jsonwebtoken";

export function verifyToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return { success: false, message: "No token provided" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, decoded };
  } catch (err) {
    return { success: false, message: "Invalid or expired token" };
  }
}


export async function getUserIdFromRequest(req) {
  const verification = verifyToken(req);
  if (!verification.success) {
    return null; // unauthorized
  }
  return verification.decoded.userId; // assuming your token payload has `id` field for userId
}