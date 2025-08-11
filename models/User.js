import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  // Profile fields
  bio: { type: String },
  age: { type: Number },
  city: { type: String },
  occupation: { type: String },
  prompts: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  photos: { type: [String], default: [] }, // S3 URLs
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
