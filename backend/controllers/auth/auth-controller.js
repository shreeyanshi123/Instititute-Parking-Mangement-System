import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const otpStore = new Map();

const sessionSecret = process.env.SESSION_SECRET;
const twilioSID = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const twilioPhoneNUmber = process.env.TWILIO_PHONE_NUMBER;

// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: emailUser, pass: emailPass },
  });

  await transporter.sendMail({
    from: emailUser,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
};

// Send OTP to Phone (Using Email-to-SMS Gateway or Twilio)
const client = new twilio(twilioSID, twilioAuthToken);

const sendPhoneOTP = async (phoneNumber, otp) => {
  const formattedPhone = phoneNumber.startsWith("+")
    ? phoneNumber.trim()
    : `+91${phoneNumber.trim()}`;

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      from: twilioPhoneNUmber, // Replace with your verified Twilio number
      to: formattedPhone, // Ensure phoneNumber follows E.164 format (e.g., +919876543210)
    });
  } catch (error) {
    console.error("Error sending OTP via SMS:", error.message);
  }
};

export const registerUser = async (req, res) => {
  const { name, role, email, phone_number, password } = req.body;

  try {
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.json({
        success: false,
        message: "User already exists with the same email!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 300000, // OTP valid for 5 mins
      userData: { name, role, email, phone_number, password: hashPassword },
    });

    await sendEmailOTP(email, otp);
    await sendPhoneOTP(phone_number, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify to complete registration.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res
      .status(400)
      .json({ success: false, message: "OTP expired or invalid." });
  }

  const { otp: storedOTP, expiresAt, userData } = storedData;

  if (Date.now() > expiresAt) {
    otpStore.delete(email); // Cleanup expired OTP
    return res
      .status(400)
      .json({ success: false, message: "OTP expired. Request a new one." });
  }

  if (storedOTP !== parseInt(otp)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP. Please try again." });
  }

  // Insert user data only after successful OTP verification
  await db
    .promise()
    .query(
      "INSERT INTO users (name, role, email, phone_number, password) VALUES (?, ?, ?, ?, ?)",
      [
        userData.name,
        userData.role,
        userData.email,
        userData.phone_number,
        userData.password,
      ]
    );

  otpStore.delete(email); // Clear OTP after successful registration

  res
    .status(200)
    .json({ success: true, message: "Registration completed successfully." });
};

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? OR phone_number = ?", [
        identifier,
        identifier,
      ]);

    if (users.length === 0) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    const checkUser = users[0];
    console.log("Logged in user from DB:", checkUser);

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password or identifier!",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser.user_id,
        role: checkUser.role,
        email: checkUser.email,
        name: checkUser.name,
      },
      sessionSecret,
      { expiresIn: "600m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser.user_id,
        name: checkUser.name,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, sessionSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token; // Read token from cookies
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized by ss" });
    }

    const decoded = jwt.verify(token, sessionSecret); // Decode token
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE user_id = ?", [decoded.id]);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found by ss" });
    }

    const user = users[0];
    res.status(200).json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number,
      },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user data" });
  }
};
