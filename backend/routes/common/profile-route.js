import express from 'express';
import { authMiddleware } from '../../controllers/auth/auth-controller.js';
import { updateProfile,verifyEmailChange } from '../../controllers/common/profile-controller.js';
const router = express.Router();


router.post('/update/:userId', updateProfile);

router.post('/verify-email/:userId', verifyEmailChange);

export default router;
