import db from "../../config/db.js";
import util from "util";
db.query = util.promisify(db.query);


// ✅ Get Slots for a Specific Location
export const getSlots = (req, res) => {
  const { location_id } = req.params;

  if (!location_id) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  db.query(
    "SELECT location_id FROM Locations WHERE location_id = ?",
    [location_id],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      if (rows.length === 0) {
        return res.status(400).json({ message: "Invalid location_id" });
      }

      db.query(
        "SELECT * FROM ParkingSlots WHERE location_id = ?",
        [location_id],
        (err, slots) => {
          if (err) {
            console.error("Database error:", err);
            return res
              .status(500)
              .json({ message: "Internal Server Error", error: err.message });
          }
          res.status(200).json({ slots });
        }
      );
    }
  );
};

// ✅ Get All Locations
export const getAllLocations = (req, res) => {
  db.query("SELECT * FROM Locations", (err, locations) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
    res.status(200).json({ locations });
  });
};

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const bookSlot = (req, res) => {
  const {
    user_id,
    vehicle_number,
    vehicle_type,
    slot_id,
    booking_time,
    end_time,
  } = req.body;

  if (
    !user_id ||
    !vehicle_number ||
    !vehicle_type ||
    !slot_id ||
    !booking_time ||
    !end_time
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.beginTransaction((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Transaction start failed", error: err.message });

    db.query(
      "SELECT is_empty FROM ParkingSlots WHERE slot_id = ? FOR UPDATE",
      [slot_id],
      (err, slot) => {
        if (err) {
          db.rollback(() => {});
          return res
            .status(500)
            .json({ message: "Database Error", error: err.message });
        }

        if (!slot.length || !slot[0].is_empty) {
          db.rollback(() => {});
          return res.status(400).json({ message: "Slot is already occupied!" });
        }

        db.query(
          "SELECT vehicle_id FROM Vehicles WHERE vehicle_number = ?",
          [vehicle_number],
          (err, vehicle) => {
            if (err) {
              db.rollback(() => {});
              return res
                .status(500)
                .json({ message: "Database Error", error: err.message });
            }

            if (vehicle.length === 0) {
              db.query(
                "INSERT INTO Vehicles (user_id, vehicle_number, vehicle_type) VALUES (?, ?, ?)",
                [user_id, vehicle_number, vehicle_type],
                (err, result) => {
                  if (err) {
                    db.rollback(() => {});
                    return res.status(500).json({
                      message: "Database Error",
                      error: err.message,
                    });
                  }
                  insertBooking(result.insertId);
                }
              );
            } else {
              insertBooking(vehicle[0].vehicle_id);
            }
          }
        );

        function insertBooking(vehicle_id) {
          db.query(
            "INSERT INTO Bookings (user_id, vehicle_id, slot_id, booking_time, end_time, status) VALUES (?, ?, ?, ?, ?, 'Active')",
            [user_id, vehicle_id, slot_id, booking_time, end_time],
            (err, booking) => {
              if (err) {
                db.rollback(() => {});
                return res.status(500).json({
                  message: "Database Error",
                  error: err.message,
                });
              }

              db.query(
                "UPDATE ParkingSlots SET is_empty = FALSE WHERE slot_id = ?",
                [slot_id],
                (err) => {
                  if (err) {
                    db.rollback(() => {});
                    return res.status(500).json({
                      message: "Database Error",
                      error: err.message,
                    });
                  }

                  db.query(
                    "SELECT email FROM Users WHERE user_id = ?",
                    [user_id],
                    (err, userRows) => {
                      if (err || userRows.length === 0) {
                        db.rollback(() => {});
                        return res.status(500).json({
                          message: "User email fetch failed",
                          error: err?.message,
                        });
                      }

                      const userEmail = userRows[0].email;

                      db.commit((err) => {
                        if (err) {
                          db.rollback(() => {});
                          return res.status(500).json({
                            message: "Transaction commit failed",
                            error: err.message,
                          });
                        }

                        // ✅ Send Email
                        const transporter = nodemailer.createTransport({
                          service: "Gmail",
                          auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                          },
                        });

                        // Convert datetime strings to readable format
                        const formattedBookingTime = new Date(
                          booking_time
                        ).toLocaleString("en-US", {
                          dateStyle: "full",
                          timeStyle: "short",
                        });

                        const formattedEndTime = new Date(
                          end_time
                        ).toLocaleString("en-US", {
                          dateStyle: "full",
                          timeStyle: "short",
                        });

                        const mailOptions = {
                          from: process.env.EMAIL_USER,
                          to: userEmail,
                          subject: "✅ Parking Slot Booked Successfully",
                          text: `Your slot has been successfully booked!

                          Slot ID: ${slot_id}
                          Vehicle Number: ${vehicle_number}
                          Booking Start Time: ${formattedBookingTime}
                          End Time: ${formattedEndTime}
                                                  
                          Thank you for using our service.`,
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                            console.error("❌ Email send failed:", error);
                          } else {
                            console.log("✅ Email sent:", info.response);
                          }
                        });

                        res.status(201).json({
                          message: "Slot booked successfully!",
                          booking_id: booking.insertId,
                        });
                      });
                    }
                  );
                }
              );
            }
          );
        }
      }
    );
  });
};

// ✅ Cancel Booking
export const cancelBooking = (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ message: "Booking ID is required" });
  }

  db.beginTransaction((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Transaction start failed", error: err.message });

    // Check if booking exists
    db.query(
      "SELECT slot_id FROM Bookings WHERE booking_id = ? AND status = 'Active'",
      [booking_id],
      (err, booking) => {
        if (err) {
          db.rollback(() => {});
          return res
            .status(500)
            .json({ message: "Database Error", error: err.message });
        }

        if (!booking.length) {
          db.rollback(() => {});
          return res
            .status(400)
            .json({ message: "Invalid or inactive booking" });
        }

        const slot_id = booking[0].slot_id;

        // Update booking status
        db.query(
          "UPDATE Bookings SET status = 'Cancelled' WHERE booking_id = ?",
          [booking_id],
          (err) => {
            if (err) {
              db.rollback(() => {});
              return res
                .status(500)
                .json({ message: "Database Error", error: err.message });
            }

            // Mark slot as empty
            db.query(
              "UPDATE ParkingSlots SET is_empty = TRUE WHERE slot_id = ?",
              [slot_id],
              (err) => {
                if (err) {
                  db.rollback(() => {});
                  return res
                    .status(500)
                    .json({ message: "Database Error", error: err.message });
                }

                db.commit((err) => {
                  if (err) {
                    db.rollback(() => {});
                    return res.status(500).json({
                      message: "Transaction commit failed",
                      error: err.message,
                    });
                  }
                  res
                    .status(200)
                    .json({ message: "Booking cancelled successfully" });
                });
              }
            );
          }
        );
      }
    );
  });
};

export const getUserBookings = async (req, res) => {
  console.log("req.user:", req.user);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request." });
    }
  try {
    // Active bookings (not released)
    const [currentBookings] = await db.query(
      `SELECT b.booking_id, b.vehicle_id, b.slot_id, l.location_name,
              b.booking_time, b.status, b.end_time , v.vehicle_number
       FROM bookings b
       JOIN parkingslots s ON b.slot_id = s.slot_id
       JOIN locations l ON s.location_id = l.location_id
       JOIN vehicles v ON b.vehicle_id = v.vehicle_id
        WHERE b.user_id = ? AND b.released = 0 AND b.status = 'Active'`,
      [userId]
    );
    
    console.log("currentBookings:", currentBookings);
    
    // Past bookings (released or completed/expired)
    const [pastBookings] = await db.query(
      `SELECT b.booking_id, b.vehicle_id, b.slot_id, l.location_name,
              b.booking_time, b.end_time, b.status, v.vehicle_number
       FROM bookings b
       JOIN parkingslots s ON b.slot_id = s.slot_id
       JOIN locations l ON s.location_id = l.location_id 
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
       WHERE b.user_id = ? AND (b.released = 1 OR b.status IN ('Completed', 'Expired'))`,
      [userId]
    );
    console.log("pastBookings:", pastBookings);
    
    res.json({ currentBookings, pastBookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    console.error("Database Error", err.message);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
