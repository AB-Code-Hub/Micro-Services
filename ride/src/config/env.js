import dotenv from 'dotenv'

dotenv.config()

export const {
    BASE_URL,
    DB_URL,
    jWT_SECRET, 
    RABIT_URL,
    } = process.env