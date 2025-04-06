import express from 'express';
export const router = express.Router();
import { login , logout , profile , register  } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';


router.post('/register', register)
router.post('/login', login)
router.get('/logout',authMiddleware,  logout)
router.get('/profile', authMiddleware, profile)




