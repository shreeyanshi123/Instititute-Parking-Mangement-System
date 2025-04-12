import express from 'express';
import { updateProfile,updatePassword } from '../../controllers/common/profile-controller.js';
const router = express.Router();


router.put('/update/:userId', updateProfile);
router.put('/updatePassword', updatePassword); // Assuming you have a function to update password

export default router;
