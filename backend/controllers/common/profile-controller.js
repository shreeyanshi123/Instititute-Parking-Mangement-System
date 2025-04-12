import db from "../../config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const result = await db.query(
      `UPDATE users SET name = ?, email = ? WHERE user_id = ?`,
      [name || null, email || null, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes made." });
    }

    return res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update profile." });
  }
};


export const updatePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
 

  if (!id || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    // Fetch user from the database
    const [user] = await db.query('SELECT * FROM Users WHERE user_id = ?', [id]);
    // console.log(user);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if old password matches
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db.query('UPDATE Users SET password = ? WHERE user_id = ?', [hashedPassword, id]);

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};
