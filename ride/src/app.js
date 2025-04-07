import express from 'express'
import { router as ridesRoutes } from './routes/rides.routes.js'
import { connectQueue as connectRabbitQueue } from './service/rabbit.js'
import connectDb from './db/connectDb.js'
import cookieparser from 'cookie-parser'

const app = express()
connectDb()
connectRabbitQueue()
app.use(express.json())
app.use(express.urlencoded({ extended: true})) 
app.use(cookieparser())

app.use('/', ridesRoutes)

export default app;