import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

 const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',      
    user: process.env.USER_NAME || 'root',  
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'ParkingManagementSystem',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL Database!');
});

export default db; 