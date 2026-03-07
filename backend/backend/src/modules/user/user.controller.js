import { userModel } from "../../../database/model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../../mail/user.email.js";
import errHandling from "../../utils/errorHandling.js";
import appError from "../../utils/appError.js";
import errorHandling from "../../utils/errorHandling.js";

export const signup = errorHandling(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new appError("Email already in use", 400));
  }

  // Hash password
  const hash = await bcrypt.hash(password, 12);

  // Create new user
  const newUser = await userModel.create({
    name,
    email,
    password: hash,
    confirmEmail: false,
  });

  // Send verification email
  try {
    await sendEmail({ email });
    res.status(201).json({
      message:
        "User created successfully. Please check your email to verify your account.",
      userId: newUser._id,
    });
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    // User is created but email failed - they can request resend later
    res.status(201).json({
      message: "User created successfully. Email verification may be delayed.",
      userId: newUser._id,
    });
  }
});

export const verify = errHandling(async (req, res, next) => {
  const { mailToken } = req.params;

  try {
    const decoded = jwt.verify(mailToken, "mennaalyfahmy");

    const user = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { confirmEmail: true },
      { new: true }
    );

    if (!user) {
      return next(new appError("User not found", 404));
    }

    res.json({
      message:
        "Email verified successfully! You can now sign in to your account.",
    });
  } catch (err) {
    return next(new appError("Invalid or expired verification token", 400));
  }
});

export const signin = errHandling(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new appError("Invalid email or password", 401));
  }

  // Check if email is verified
  if (!user.confirmEmail) {
    return next(
      new appError("Please verify your email before signing in", 401)
    );
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new appError("Invalid email or password", 401));
  }

  // Generate token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    "mennaalyfahmy",
    {
      expiresIn: "7d",
    }
  );

  // Remove password from response
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({
    message: "Signed in successfully",
    token,
    user: userResponse,
  });
});
