import cron from 'node-cron';
import db from '../config/db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

const sentVisitorEmails = new Map(); // Track reminders already sent

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const connection = db.promise();

const checkVisitorSlots = async () => {
  console.log("\n🚦 Visitor Cron Job Triggered: Checking reserved visitor slots...");

  try {
    const [bookings] = await connection.query(`
      SELECT b.booking_id, b.booking_time, b.slot_id, b.is_confirmed, u.email
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      WHERE b.status = 'Reserved'
    `);

    console.log(`🔎 Found ${bookings.length} reserved visitor booking(s) to check.`);

    const now = moment();

    for (const booking of bookings) {
      const bookingTime = moment(booking.booking_time);
      const minutesPassed = now.diff(bookingTime, 'minutes');

      console.log(`\n➡️ Checking Booking ID: ${booking.booking_id}`);
      console.log(`   • Email: ${booking.email}`);
      console.log(`   • Slot ID: ${booking.slot_id}`);
      console.log(`   • Booking Time: ${bookingTime.format("YYYY-MM-DD HH:mm:ss")}`);
      console.log(`   • Minutes Passed: ${minutesPassed}`);
      console.log(`   • Confirmed: ${booking.confirmed}`);

      // Reminder email after 25 mins (if not already sent)
      if (minutesPassed >= 25 && minutesPassed < 30) {
        const cacheKey = `reminder-${booking.booking_id}`;
        if (!sentVisitorEmails.has(cacheKey)) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: '⏰ Visitor Slot Reminder',
            text: `Reminder: Please confirm your visitor parking slot (Slot ID: ${booking.slot_id}) within 5 minutes or it will be released automatically.`,
          };

          try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Reminder email sent to ${booking.email}`);
            sentVisitorEmails.set(cacheKey, true);
          } catch (err) {
            console.error(`❌ Failed to send reminder to ${booking.email}:`, err.message);
          }
        }
      }

      // Mark as expired and release after 30 mins if not confirmed
      if (minutesPassed >= 30 && !booking.confirmed) {
        console.log(`⚠️ Booking ID ${booking.booking_id} not confirmed in 30 minutes. Expiring...`);

        await connection.query(`
          UPDATE bookings SET status = 'Expired' WHERE booking_id = ?
        `, [booking.booking_id]);

        await connection.query(`
          UPDATE parkingslot SET reserved = 0 WHERE slot_id = ?
        `, [booking.slot_id]);

        await connection.query(`
          DELETE FROM permanent_reserve WHERE slot_id = ?
        `, [booking.slot_id]);

        console.log(`📤 Booking ${booking.booking_id} marked as 'Expired'.`);
        console.log(`🔓 Slot ${booking.slot_id} released and removed from permanent_reserve.`);
      }
    }

    console.log("✅ Visitor slot monitoring completed.\n");
  } catch (err) {
    console.error("❌ Error in visitor slot cron job:", err.message);
  }
};

// Run every 1 minute
cron.schedule('* * * * *', checkVisitorSlots);
