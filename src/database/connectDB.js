import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
})

export default pool