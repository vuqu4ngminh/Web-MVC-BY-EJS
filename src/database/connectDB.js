import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
})

export default pool