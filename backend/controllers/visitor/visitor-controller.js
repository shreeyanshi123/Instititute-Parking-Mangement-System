import db from "../../config/db.js";
import moment from "moment";

export const bookVisitorSlot = async (req, res) => {
  const { slotId, vehicleNumber, vehicleType } = req.body;
  const userId = req.user.id;
  console.log(req.user.id);
  console.log(slotId,"slotid");

  try {
    const connection = db.promise();
    // 1. Insert into vehicles (ignore if exists)
    const [existingVehicle] = await connection.query(
      `SELECT vehicle_id FROM vehicles WHERE vehicle_number = ?`,
      [vehicleNumber]
    );

    let vehicleId;

    if (existingVehicle.length > 0) {
      vehicleId = existingVehicle[0].vehicle_id;
    } else {
      const [vehicleInsert] = await connection.query(
        `INSERT INTO vehicles (user_id, vehicle_number, vehicle_type) VALUES (?, ?, ?)`,
        [userId, vehicleNumber, vehicleType]
      );
      vehicleId = vehicleInsert.insertId;
    }

    // 2. Mark parkingslot as reserved
    await connection.query(
      `UPDATE parkingslots SET reserved = 1 WHERE slot_id = ?`,
      [slotId]
    );

    // 3. Insert into permanent_reserve
    await connection.query(
      `INSERT INTO permanent_reserve (slot_id, user_id, vehicle_number) VALUES (?, ?, ?)`,
      [slotId, userId, vehicleNumber]
    );

    // 4. Insert into bookings
    const bookingMoment = moment();
    const booking_time = bookingMoment.format("YYYY-MM-DD HH:mm:ss");
    const end_time = bookingMoment.add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
    const [bookingResult] = await connection.query(
      `INSERT INTO bookings (user_id, vehicle_id, slot_id,released, booking_time,end_time, status, is_confirmed) 
         VALUES (?, ?, ?, false,?,?, 'Reserved',false)`,
      [userId, vehicleId, slotId, booking_time, end_time]
    );

    res.status(200).json({
      message: "Visitor slot booked successfully",
      bookingId: bookingResult.insertId,
    });
  } catch (error) {
    console.error("Error booking visitor slot:", error);
  
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('permanent_reserve.slot_id')) {
      return res.status(409).json({ error: "Slot already reserved by another visitor." });
    }
  
    res.status(500).json({ error: "Failed to book slot" });
  }
};

export const confirmVisitorSlot = async (req, res) => {
  const { slotId, end_time } = req.body;
  console.log("Received end_time:", req.body.end_time);

  try {
    const connection = db.promise();
    const [bookingRes] = await connection.query(
      `SELECT booking_id FROM bookings WHERE slot_id = ? AND status = 'Reserved'`,
      [slotId]
    );

    if (bookingRes.length === 0) {
      return res
        .status(404)
        .json({ error: "Booking not found or already confirmed" });
    }

    const bookingId = bookingRes[0].booking_id;
    // 2. Update bookings table
    await connection.query(
      `UPDATE bookings 
       SET end_time = ?, is_confirmed = true , status= 'Active'
       WHERE booking_id = ?`,
      [end_time, bookingId]
    );

    // 3. Update parkingslot to reserved = 0 (unreserve as it's now confirmed)
    await connection.query(
      `UPDATE parkingslots SET reserved = 0, is_empty = 0 WHERE slot_id = ?`,
      [slotId]
    );

    // 4. Delete from permanent_reserve
    await connection.query(`DELETE FROM permanent_reserve WHERE slot_id = ?`, [
      slotId,
    ]);

    return res.status(200).json({
      success: true,
      message: "Slot confirmed successfully",
    });
    
  } catch (error) {
    console.error("Error confirming visitor slot:", error);
    res.status(500).json({ error: "Failed to confirm slot" });
  }
};

export const getReservedVisitorCount = async (req, res) => {
    try {  
      const userId = req.user.id;
      const connection = db.promise();
      const query = `
        SELECT COUNT(*) AS count
        FROM bookings
        WHERE user_id = ? AND status = 'Reserved'
      `;
  
      const [rows] = await connection.execute(query, [userId]);
      return res.status(200).json({ success: true, count: rows[0].count,role:req.user.role });
    } catch (error) {
      console.error("Error fetching reserved visitor count:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };


export const getReservedSlots = async (req, res) => {
  try {
    const connection = db.promise();
    console.log("User from req.user:", req.user); // ⛳ What does this log?
    const userId = req.user?.id; 
    const query = `
      SELECT b.booking_id, b.slot_id, b.booking_time, b.status,
             ps.vehicle_type, ps.location_id, l.location_name,
             v.vehicle_number FROM bookings b
      JOIN parkingslots ps ON b.slot_id = ps.slot_id
      JOIN locations l ON ps.location_id = l.location_id
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
      WHERE b.user_id = ? AND b.status = 'Reserved'
    `;

    const [rows] = await connection.execute(query, [userId]);
    return res.status(200).json({ success: true, reservedSlots: rows });
  } catch (error) {
    console.error("Error fetching reserved slots:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unreserveVisitorSlot = async (req, res) => {
  const { slotId } = req.body;
  const userId = req.user.id;

  try {
    const connection = db.promise();

    // 1. Set slot to not reserved
    await connection.query(
      `UPDATE parkingslots SET reserved = 0 WHERE slot_id = ?`,
      [slotId]
    );

    // 2. Delete from permanent_reserve
    await connection.query(
      `DELETE FROM permanent_reserve WHERE slot_id = ? AND user_id = ?`,
      [slotId, userId]
    );

    // 3. Mark booking as released + status = Cancelled
    await connection.query(
      `UPDATE bookings SET released = 1, status = 'Cancelled' WHERE slot_id = ? AND user_id = ? AND status = 'Reserved'`,
      [slotId, userId]
    );

    res.status(200).json({ message: "Slot unreserved successfully." });
  } catch (error) {
    console.error("Error unreserving slot:", error);
    res.status(500).json({ error: "Failed to unreserve slot." });
  }
};

