import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "db.wrvcqmyyjzemgagalzub.supabase.co",
  user: "postgres",
  password: "kiri74493570to",
  database: "postgres",
  port: 5432,
  ssl: { rejectUnauthorized: false }
});
