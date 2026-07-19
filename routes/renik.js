import express from 'express';
import { login, register, getMe } from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getUserData } from '../controllers/noteControllers.js';

const router = express.Router()

router.post('/login', login)
router.post('/regist', register)
router.get('/me', authMiddleware, getMe)
router.get('/api/user/data', authMiddleware, getUserData)

export default router;