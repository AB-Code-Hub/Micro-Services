import jwt from 'jsonwebtoken'
import { BASE_URL, jWT_SECRET } from '../config/env.js'
import axios from 'axios'


export const authRide = async (req, res, next) => {
    try {

        const token = req.cookies.token || req.headers.authorization.split(' ')[1]

        if(!token) {
            return res.status(401).json({message: "Invalid token or token expired"})
        }

        const decodedUser = jwt.verify(token, jWT_SECRET)

       const response = await axios.get(`${BASE_URL}/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
       })

       console.log(response.data)

       const user = response.data;

       if(!user) {
        return res.status(401).json({message: "Unauthorized"})
       }

       req.user = user;

        next()

    } catch (error) {
        console.error("Error in authRide middleware", error)
        return res.status(500).json({message: "Internal server error", error: error.message})
    }
}