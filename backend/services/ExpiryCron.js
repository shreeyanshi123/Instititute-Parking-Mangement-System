import cron from 'node-cron';
import db from '../config/db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// In-memory cache to track sent reminder and expiry emails
const sentEmails = new Map();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const connection = db.promise();

const sendReminderEmails = async () => {
  console.log("\n⏱️ Cron job triggered: Checking for reminders and expiries...");

  try {
    // 1️⃣ Send Reminder Emails (only if not already sent)
    const [reminders] = await connection.query(`
      SELECT b.booking_id, b.slot_id, b.end_time, u.email, v.vehicle_number
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
      WHERE b.released = 0 AND b.status = 'Active'
        AND TIMESTAMPDIFF(MINUTE, NOW(), b.end_time) BETWEEN 1 AND 10
    `);

    console.log(`🔍 Found ${reminders.length} booking(s) needing reminder emails.`);

    for (const booking of reminders) {
      // If reminder email was already sent, skip it
      if (sentEmails.has(`reminder-${booking.booking_id}`)) {
        continue;
      }

      const formattedEndTime = new Date(booking.end_time).toLocaleString('en-US', {
        dateStyle: "full",
        timeStyle: "short",
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: "⏰ Parking Slot End Time Reminder",
        text: `Hi there! This is a reminder that your parking time is about to end.

Vehicle Number: ${booking.vehicle_number}
Slot ID: ${booking.slot_id}
Scheduled End Time: ${formattedEndTime}

Please ensure your vehicle is released before time to avoid penalties.

Thank you!`
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Reminder email sent to ${booking.email}`);

      // Mark as sent in the in-memory cache
      sentEmails.set(`reminder-${booking.booking_id}`, true);
    }

    // 2️⃣ Handle Expired Bookings (only if expiry email not sent)
    const [expired] = await connection.query(`
      SELECT b.booking_id, b.slot_id, b.end_time, u.email, v.vehicle_number
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
      WHERE b.released = 0 AND b.status = 'Active'
        AND b.end_time < NOW()
    `);

    console.log(`⚠️ Found ${expired.length} booking(s) that have expired.`);

    for (const booking of expired) {
      // If expiry email was already sent, skip it
      if (sentEmails.has(`expiry-${booking.booking_id}`)) {
        continue;
      }

      const formattedEndTime = new Date(booking.end_time).toLocaleString('en-US', {
        dateStyle: "full",
        timeStyle: "short",
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: "🚨 Parking Time Expired",
        text: `Hello,

Your parking slot time has **expired**.

Vehicle Number: ${booking.vehicle_number}
Slot ID: ${booking.slot_id}
End Time: ${formattedEndTime}

Please vacate the slot as soon as possible to avoid further issues.

- Parking Management Team`
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Expiry email sent to ${booking.email}`);

      // Mark as sent in the in-memory cache
      sentEmails.set(`expiry-${booking.booking_id}`, true);

      // Update status to Expired
      await connection.query(`
        UPDATE bookings SET status = 'Expired' WHERE booking_id = ?
      `, [booking.booking_id]);
      console.log(`🔄 Booking ${booking.booking_id} status updated to 'Expired'`);
    }

  } catch (err) {
    console.error("❌ Cron Job Error:", err.message);
  }
};

// Schedule cron job to run every minute
cron.schedule('* * * * *', sendReminderEmails);
