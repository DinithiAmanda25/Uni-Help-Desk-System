import express from 'express';
import { authUser, registerUser, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);

export default router;
