import express from 'express'
import { authRide } from '../middleware/authRide.middleware.js'
import { createRide } from '../controllers/ride.controller.js'
export const router = express.Router()


router.post('/create-ride', authRide, createRide )
