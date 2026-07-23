import express from 'express';
import { login, register, getMe } from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getUserData, addCompound, deleteCompound, updateCompound, removeTag } from '../controllers/noteControllers.js';

const router = express.Router()

router.post('/login', login)
router.post('/regist', register)
router.get('/me', authMiddleware, getMe)
router.get('/api/user/data', authMiddleware, getUserData)
router.post('/api/compounds', authMiddleware, addCompound)
router.delete('/api/compounds', authMiddleware, deleteCompound)
router.put('/api/compounds', authMiddleware, updateCompound)
router.delete('/api/compounds/tags', authMiddleware, removeTag)

export default router;