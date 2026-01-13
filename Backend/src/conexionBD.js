console.log("🟡 EJECUTANDO conexionBD.js");

import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:kiri74493570to@db.wrvcqmyyjzemgagalzub.supabase.co:5432/postgres",

  ssl: {
    rejectUnauthorized: false,
  },

  family: 4, // 🔥 FORZAR IPv4 (CLAVE PARA RENDER)
});

// Test de conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error de conexión a Supabase:", err);
    return;
  }

  console.log("✅ Conexión exitosa a la base de datos en la nube");
  release();
});

