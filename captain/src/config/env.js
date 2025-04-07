import dotenv from "dotenv";

dotenv.config();

export const { jWT_SECRET, DB_URL, RABIT_URL } = process.env;
