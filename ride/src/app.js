import express from 'express'
import { router as ridesRoutes } from './routes/rides.routes.js'
import connectDb from './db/connectDb.js'
import cookieparser from 'cookie-parser'

const app = express()
connectDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true})) 
app.use(cookieparser())

app.use('/', ridesRoutes)

export default app;