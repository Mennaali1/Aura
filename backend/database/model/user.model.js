import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "too short"],
    maxLength: [25, "too long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },

  confirmEmail: {
    type: Boolean,
    default: false,
  },
});

export const userModel = mongoose.model("user", userSchema);
