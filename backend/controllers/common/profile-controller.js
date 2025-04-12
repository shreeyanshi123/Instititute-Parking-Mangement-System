import db from "../../config/db.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // Make sure to load the environment variables

const twilioSID = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const twilioPhoneNUmber = process.env.TWILIO_PHONE_NUMBER;

// Store OTPs temporarily (for simplicity, using Map)
const otpStore = new Map();

// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP Email
const sendEmailOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    await transporter.sendMail({
        from: emailUser,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
};

// Send OTP SMS (via Twilio)
const client = new twilio(twilioSID, twilioAuthToken);

const sendPhoneOTP = async (phoneNumber, otp) => {
    const formattedPhone = phoneNumber.startsWith('+')
        ? phoneNumber.trim()
        : `+91${phoneNumber.trim()}`;

    try {
        await client.messages.create({
            body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
            from: twilioPhoneNUmber,
            to: formattedPhone,
        });
    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
    }
};







// Profile Update Handler
export const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { type, value } = req.body;

    try {
        if (type === 'name') {
            await db.query('UPDATE users SET name = ? WHERE id = ?', [value, userId]);
            return res.json({ message: 'Name updated successfully' });
        }

        if (type === 'email') {
            const otp = generateOTP();
            otpStore.set(userId, { otp, email: value, expires: Date.now() + 5 * 60 * 1000 });

            await sendEmailOTP(value, otp);
            return res.json({ message: 'OTP sent to new email. Please verify to update.' });
        }

        return res.status(400).json({ message: 'Invalid update type' });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Email Verification Handler
export const verifyEmailChange = async (req, res) => {
    const { userId } = req.params;
    const { otp } = req.body;

    const stored = otpStore.get(userId);

    if (!stored) return res.status(400).json({ message: 'No OTP found. Try again.' });

    if (Date.now() > stored.expires)
        return res.status(400).json({ message: 'OTP expired. Request a new one.' });

    if (stored.otp != otp)
        return res.status(400).json({ message: 'Invalid OTP' });

    // OTP matches, update email
    await db.query('UPDATE users SET email = ? WHERE id = ?', [stored.email, userId]);
    otpStore.delete(userId);

    res.json({ message: 'Email updated successfully' });
};
