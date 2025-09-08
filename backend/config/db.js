import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.query("SELECT current_database(), current_user;", (err, res) => {
  if (err) {
    console.error("❌ DB check failed:", err.message);
  } else {
    console.log(
      `✅ Connected to DB: ${res.rows[0].current_database} as user: ${res.rows[0].current_user}`
    );
  }
});

export default pool;