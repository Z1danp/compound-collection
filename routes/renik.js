import express from 'express';
import { login, register, getMe } from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/login', login)
router.post('/regist', register)
router.get('/me', authMiddleware, getMe)

export default router;