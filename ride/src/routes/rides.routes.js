import express from 'express'
import { authRide, capAuth } from '../middleware/authRide.middleware.js'
import { acceptRide, createRide } from '../controllers/ride.controller.js'
export const router = express.Router()


router.post('/create-ride', authRide, createRide )
router.put('/accept-ride', capAuth, acceptRide )
