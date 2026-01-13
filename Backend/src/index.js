import express from "express";
import cors from "cors";
import authRoutes from "./Rutas/auth.routes.js";
import incidenciasRoutes from "./Rutas/incidencias.routes.js";
import denunciasRoutes from "./Rutas/denuncias.routes.js";
import reportesRoutes from "./Rutas/reportes.routes.js";
import evidenciasRoutes from "./Rutas/evidencias.routes.js";
import notificacionesRoutes from "./Rutas/notificaciones.routes.js";
import { pool } from "./conexionBD.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("🚀 Backend CUSCO_REPORTA funcionando");
});

// Auth
app.use("/api/auth", authRoutes);
// Incidencias
app.use("/api/incidencias", incidenciasRoutes);
// Denuncias
app.use("/api/denuncias", denunciasRoutes);
// Reportes
app.use("/api/reportes", reportesRoutes);
// Evidencias
app.use("/api/evidencias", evidenciasRoutes);
// Notificaciones
app.use("/api/notificaciones", notificacionesRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Verificar conexión a la base de datos al iniciar
(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Conexión a la base de datos: OK');
  } catch (err) {
    console.error('Error conectando a la base de datos:', err.message || err);
  }
})();

// Endpoint de diagnóstico de BD
app.get('/api/health/db', async (req, res) => {
  try {
    const r = await pool.query('SELECT NOW() as now');
    return res.json({ ok: true, now: r.rows[0].now });
  } catch (err) {
    console.error('Health check DB error:', err.message || err);
    return res.status(500).json({ ok: false, mensaje: 'No se pudo conectar a la BD', error: err.message });
  }
});
