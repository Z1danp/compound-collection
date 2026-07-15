import express from 'express';
import { login, register } from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/login', login)
router.post('/regist', register)

export default router;