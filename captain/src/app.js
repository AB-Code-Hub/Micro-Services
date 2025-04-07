import express from 'express'
import { router as captainRoutes} from './routes/captain.routes.js'
import { connectQueue } from './service/rabbit.js'
import cookieParser from 'cookie-parser'
import connectDb  from './db/connectDb.js'
connectDb();
connectQueue()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use('/', captainRoutes) 

export default app