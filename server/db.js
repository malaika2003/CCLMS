import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: process.env.DB_PASSWORD,
    port: 5432,
    database: "auth"
  });
  
export default pool;