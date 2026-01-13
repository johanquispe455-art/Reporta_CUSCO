import pkg from "pg";
const { Pool } = pkg;

// Render usa una "connectionString" (un solo texto con todo)
// Si no existe, usa tus datos de Supabase que ya tienes
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:kiri74493570to@db.wrvcqmyyjzemgagalzub.supabase.co:5432/postgres",
  ssl: { 
    rejectUnauthorized: false 
  }
});
// Añade esto al final de tu archivo conexionBD.js
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error de conexión a Supabase:', err.message);
  }
  console.log('✅ Conexión exitosa a la base de datos en la nube');
  release();
});
