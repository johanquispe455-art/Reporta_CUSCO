import pkg from "pg";
const { Pool } = pkg;

console.log("🟡 EJECUTANDO conexionBD.js");
console.log("🔥 CONFIG PG -> family = 4");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4, // 👈 ESTO ES LO IMPORTANTE
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error de conexión a Supabase:", err);
    return;
  }
  console.log("✅ Conexión exitosa a la base de datos en la nube");
  release();
});
