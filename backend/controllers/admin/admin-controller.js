import db from "../../config/db.js";
import { imageUploadUtil } from "../../helpers/cloudinary.js";

export const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({
      success: false,
      message: "Error occurred while uploading the image",
    });
  }
};

export const addLocation = async (req, res) => {
  const {
    location_name,
    image_url,
    two_wheeler_slots,
    four_wheeler_slots,
    bus_parking_slots,
  } = req.body;

  if (
    !location_name ||
    two_wheeler_slots < 0 ||
    four_wheeler_slots < 0 ||
    bus_parking_slots < 0
  ) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const connection = db.promise();

    await connection.query("START TRANSACTION");

    const [locationResult] = await connection.query(
      `INSERT INTO Locations (location_name, image_url, two_wheeler_slots, four_wheeler_slots, bus_parking_slots) 
            VALUES (?, ?, ?, ?, ?)`,
      [
        location_name,
        image_url,
        two_wheeler_slots,
        four_wheeler_slots,
        bus_parking_slots,
      ]
    );

    const location_id = locationResult.insertId;

    let slotInserts = [];

    for (let i = 0; i < two_wheeler_slots; i++) {
      slotInserts.push([location_id, "two-wheeler"]);
    }
    for (let i = 0; i < four_wheeler_slots; i++) {
      slotInserts.push([location_id, "four-wheeler"]);
    }
    for (let i = 0; i < bus_parking_slots; i++) {
      slotInserts.push([location_id, "bus"]);
    }

    if (slotInserts.length > 0) {
      await connection.query(
        `INSERT INTO ParkingSlots (location_id, vehicle_type) VALUES ?`,
        [slotInserts]
      );
    }

    await connection.query("COMMIT"); // Commit transaction

    res
      .status(201)
      .json({ message: "Location and slots added successfully", location_id });
  } catch (error) {
    await db.promise().query("ROLLBACK"); // Rollback in case of error
    res
      .status(500)
      .json({ message: "Error adding location", error: error.message });
  }
};

export const editLocation = async (req, res) => {
  const { location_id } = req.params;
  const { vehicle_type } = req.body;
  console.log(location_id);
  console.log(req.params);
  if (!location_id || !vehicle_type) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const connection = db.promise();

    // Check if location_id exists
    const [rows] = await connection.query(
      "SELECT location_id FROM Locations WHERE location_id = ?",
      [location_id]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid location_id" });
    }

    // Insert new parking slot
    await connection.query(
      `INSERT INTO ParkingSlots (location_id, vehicle_type, is_empty,reserved) 
             VALUES (?, ?, ?, ?)`,
      [location_id, vehicle_type, true, false]
    );

    res.status(201).json({ message: "Parking slot added successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

import nodemailer from "nodemailer";

export const ReleaseSlot = async (req, res) => {
  try {
    const connection = db.promise();
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ error: " slotId is required" });
    }

    console.log("🔹 Releasing Slot ID:", slotId);

    // ✅ Step 1: Update Parking Slot as Empty
    const [slotUpdateResult] = await connection.query(
      "UPDATE ParkingSlots SET is_empty = 1 WHERE slot_id = ?",
      [slotId]
    );

    if (slotUpdateResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: " Slot not found or already empty" });
    }

    // ✅ Step 2: Get full booking + user + vehicle + location info
    const [bookingRows] = await connection.query(
      `SELECT b.booking_id, b.vehicle_id, b.user_id, b.booking_time, b.end_time, b.status,
              u.email, v.vehicle_number, v.vehicle_type, l.location_name AS location_name
       FROM Bookings b
       JOIN Users u ON b.user_id = u.user_id
       JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
       JOIN ParkingSlots ps ON b.slot_id = ps.slot_id
       JOIN Locations l ON ps.location_id = l.location_id
       WHERE b.slot_id = ? AND b.released = 0 AND (b.status = 'Active' OR b.status = 'Expired')
       ORDER BY b.booking_time DESC LIMIT 1`,
      [slotId]
    );

    if (bookingRows.length === 0) {
      return res
        .status(404)
        .json({ error: " No active or expired booking found for this slot" });
    }

    const booking = bookingRows[0];

    // ✅ Step 3: Mark booking as released & completed
    await connection.query(
      "UPDATE Bookings SET released = 1, status = 'Completed' WHERE booking_id = ?",
      [booking.booking_id]
    );

    // ✅ Step 4: Send email with full details
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "📤 Parking Slot Released Successfully",
      text: `
  Dear User,
  
  ✅ Your vehicle has been successfully released from the parking slot.
  
  🔹 Booking Details:
  - Vehicle Number: ${booking.vehicle_number}
  - Vehicle Type: ${booking.vehicle_type}
  - Slot ID: ${slotId}
  - Booking Start Time: ${new Date(booking.booking_time).toLocaleString()}
  - Expected End Time: ${new Date(booking.end_time).toLocaleString()}
  - Final Status: Completed
  
  📍 Location Details:
  - Name: ${booking.location_name}
  
  Thank you for using our Parking Management System.
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(" Email error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({
      message:
        "✅ Slot released, booking updated, and email with full info sent",
      slotId,
      bookingId: booking.booking_id,
      vehicleId: booking.vehicle_id,
    });
  } catch (error) {
    console.error("🔥 Error releasing slot:", error);
    res.status(500).json({ error: "Server error while releasing slot" });
  }
};

export const fetchAllLocations = async (req, res) => {
  try {
    const connection = db.promise();
    // Fetch all locations
    const [locations] = await connection.query("SELECT * FROM Locations");

    res.status(200).json({
      locations,
    });
  } catch (err) {
    console.log("Database error", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// In your controller file

export const deleteLocation = async (req, res) => {
  const { location_id } = req.body; // ✅ Changed from req.params to req.body

  if (!location_id) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const connection = db.promise();

    await connection.query("START TRANSACTION");

    const [rows] = await connection.query(
      "SELECT location_id FROM Locations WHERE location_id = ?",
      [location_id]
    );

    if (rows.length === 0) {
      await connection.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid location_id" });
    }

    await connection.query("DELETE FROM ParkingSlots WHERE location_id = ?", [
      location_id,
    ]);
    await connection.query("DELETE FROM Locations WHERE location_id = ?", [
      location_id,
    ]);

    await connection.query("COMMIT");

    res.status(200).json({
      message: "Location and associated slots deleted successfully",
    });
  } catch (err) {
    await db.promise().query("ROLLBACK");
    console.error("Database error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getSlots = async (req, res) => {
  const { location_id } = req.params;

  if (!location_id) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const connection = db.promise();

    // Fetch location name along with location_id
    const [rows] = await connection.query(
      "SELECT location_name FROM Locations WHERE location_id = ?",
      [location_id]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid location_id" });
    }

    // Fetch parking slots for the given location_id
    const [slots] = await connection.query(
      "SELECT slot_id, vehicle_type, is_empty,reserved FROM ParkingSlots WHERE location_id = ?",
      [location_id]
    );

    // Organize slots by type
    const formattedSlots = {
      twoWheeler: slots.filter((slot) => slot.vehicle_type === "two-wheeler"),
      fourWheeler: slots.filter((slot) => slot.vehicle_type === "four-wheeler"),
      bus: slots.filter((slot) => slot.vehicle_type === "bus"),
    };

    res.status(200).json({
      location: {
        // Wrap in "location" to match frontend expectation
        id: location_id,
        name: rows[0].location_name,
        slots: formattedSlots,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const reserveSlot = async (req, res) => {
  const { vehicle_number, slot_id } = req.body;
  console.log(req.body, "req.body");

  try {
    const connection = db.promise();

    // Ensure only admin can reserve
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can reserve slots" });
    }

    // Check if slot exists
    const [slotRows] = await connection.query(
      "SELECT slot_id FROM parkingslots WHERE slot_id = ?",
      [slot_id]
    );
    console.log(slotRows, "slotRows");
    if (slotRows.length === 0) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if the slot is already reserved
    const [existingSlot] = await connection.query(
      "SELECT slot_id FROM permanent_reserve WHERE slot_id = ?",
      [slot_id]
    );
    console.log(existingSlot, "existingSlot");
    if (existingSlot.length > 0) {
      return res
        .status(400)
        .json({ message: "Slot is already permanently reserved" });
    }

    // Check if the vehicle already has a reservation
    const [existingVehicle] = await connection.query(
      "SELECT vehicle_number FROM permanent_reserve WHERE vehicle_number = ?",
      [vehicle_number]
    );
    console.log(existingVehicle, "existingVehicle");
    if (existingVehicle.length > 0) {
      return res
        .status(400)
        .json({ message: "Vehicle already has a permanent reservation" });
    }

    // Reserve the slot permanently
    await connection.query(
      "INSERT INTO permanent_reserve (vehicle_number, slot_id, user_id) VALUES (?, ?, ?)",
      [vehicle_number, slot_id, req.user.id] // Assuming user_id is 39 for now, replace with actual user_id if needed
    );

    await connection.query(
      "UPDATE parkingslots SET reserved = TRUE WHERE slot_id = ?",
      [slot_id]
    );

    res.status(200).json({ message: "Slot permanently reserved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const unreserveSlot = async (req, res) => {
  const { slot_id } = req.body;

  try {
    const connection = db.promise();

    // Ensure only admin can unreserve
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can unreserve slots" });
    }

    // Check if the slot is reserved
    const [existing] = await connection.query(
      "SELECT * FROM permanent_reserve WHERE slot_id = ?",
      [slot_id]
    );

    if (!existing.length) {
      return res
        .status(404)
        .json({ message: "No permanent reservation found for this slot" });
    }

    // Delete the reservation
    await connection.query("DELETE FROM permanent_reserve WHERE slot_id = ?", [
      slot_id,
    ]);

    await connection.query(
      "UPDATE parkingslots SET reserved = FALSE WHERE slot_id = ?",
      [slot_id]
    );

    await connection.query(
      `UPDATE bookings 
       SET released = TRUE, status = 'Expired' 
       WHERE slot_id = ? AND status = 'Reserved' AND released = FALSE`,
      [slot_id]
    );

    res.status(200).json({ message: "Slot unreserved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDetails = async (req, res) => {
  const { slotId } = req.body;

  try {
    const connection = db.promise();
    const [rows] = await connection.query(
      `
      SELECT 
        b.booking_id,b.booking_time,b.end_time,b.status,v.vehicle_number,v.vehicle_type,
        u.name AS user_name,
        u.email,
        u.phone_number
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
      JOIN users u ON v.user_id = u.user_id
      WHERE b.slot_id = ? 
        AND b.status = 'Active' 
        AND b.released = 0
      ORDER BY b.booking_time DESC
      LIMIT 1
      `,
      [slotId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No active booking found for this slot." });
    }

    res.status(200).json({ slotDetails: rows[0] });
  } catch (err) {
    console.error("Error fetching slot details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getUsersOverview = async (req, res) => {
  const query = `
    SELECT 
      u.user_id,
      u.name,
      COUNT(b.booking_id) AS total_bookings,
      SUM(CASE WHEN b.status = 'Active' THEN 1 ELSE 0 END) AS current_bookings
    FROM Users u
    LEFT JOIN Bookings b ON u.user_id = b.user_id
    GROUP BY u.user_id, u.name;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching user overview:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
}

import moment from 'moment';
export const getAllBookings = async (req, res) => {
  const query = `
    SELECT 
      l.location_name AS location,
      ps.slot_id AS slot,
      u.name AS user,
      b.booking_time AS start,
      b.end_time AS end,
      b.status,
      v.vehicle_number AS vehicle
    FROM Bookings b
    LEFT JOIN Users u ON b.user_id = u.user_id
    LEFT JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
    LEFT JOIN ParkingSlots ps ON b.slot_id = ps.slot_id
    LEFT JOIN Locations l ON ps.location_id = l.location_id
    WHERE b.end_time < NOW()  -- Fetch only past bookings
    ORDER BY b.end_time DESC;
  `;

  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching past bookings:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Format the response to match the required format
      const formattedResults = results.map((booking) => {
        return {
          location: booking.location,
          slot: booking.slot,
          user: booking.user,
          start: moment(booking.start).format('M/D/YY, h:mm A'),  // Format start time
          end: moment(booking.end).format('M/D/YY, h:mm A'),      // Format end time
          status: booking.status,
          vehicle: booking.vehicle,
        };
      });

      res.status(200).json(formattedResults);
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAdminUser=async(req,res)=>{
  const {userId} = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found in request." });
  }

  try {
    const connection = db.promise();

    // Categorize bookings on backend
    const [allBookings] = await connection.query(
      `SELECT b.*, ps.location_id, l.location_name, v.vehicle_number 
   FROM bookings b
   JOIN parkingslots ps ON b.slot_id = ps.slot_id
   JOIN locations l ON ps.location_id = l.location_id
   JOIN vehicles v ON b.vehicle_id = v.vehicle_id
   WHERE b.user_id = ? ORDER BY b.booking_time DESC`,
      [userId]
    );

    const currentBookings = [];
    const pastBookings = [];
    const reservedBookings = [];

    for (let booking of allBookings) {
      if (booking.status === "Reserved" && !booking.released) {
        reservedBookings.push(booking);
      } else if (!booking.released && booking.status !== "Reserved") {
        currentBookings.push(booking);
      } else {
        pastBookings.push(booking);
      }
    }

    res.status(200).json({ currentBookings, pastBookings, reservedBookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
}