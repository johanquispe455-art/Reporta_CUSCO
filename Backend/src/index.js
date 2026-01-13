import express from "express";
import cors from "cors";
import path from "path"; // Importante para las rutas de archivos

import authRoutes from "./Rutas/auth.routes.js";
import dniRoutes from "./Servicios/dni.route.js"; 
import denunciaRoutes from "./Rutas/denuncia.routes.js";
import incidenciaRoutes from "./Rutas/incidencias.routes.js"; // 1. IMPORTAR RUTAS DE INCIDENCIAS (EL MAPA)
import adminUsuarioRoutes from "./Rutas/adminusuario.routes.js";
import adminIncidenciasRoutes from "./Rutas/denuncia_admin.routes.js";
import reporteRoutes from "./Rutas/reporteRoutes.js";
const app = express();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use(cors());
app.use(express.json());

// SERVIR ARCHIVOS ESTÁTICOS (Para que las fotos se vean en el navegador)
// Esto permite que al entrar a https://reporta-cusco.onrender.com/uploads/foto.jpg la imagen cargue
app.use('/uploads', express.static('uploads'));

// Ruta base
app.get("/", (req, res) => {
  res.send("🚀 Backend CUSCO_REPORTA funcionando");
});

// Registrar Rutas
app.use("/api/auth", authRoutes); 
app.use("/api", dniRoutes);       
app.use("/api/denuncias", denunciaRoutes); 
app.use("/api/incidencias", incidenciaRoutes); // 2. REGISTRAR RUTA PARA EL MAPA Y STATS
app.use("/api/usuario", adminUsuarioRoutes);
app.use("/api/reportes", reporteRoutes);

// 1. Configurar la carpeta donde está tu HTML (suponiendo que se llama 'Frontend')
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'Frontend')));

// 2. Ruta para que cualquier link cargue el index.html (Útil para navegación)
app.get('*', (req, res, next) => {
    // Si la ruta empieza con /api, no hagas nada (deja que sigan las rutas de abajo)
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.use("/api/admin-incidencias", adminIncidenciasRoutes);

