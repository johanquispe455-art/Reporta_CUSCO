import { Router } from "express";
import { login, register, solicitarRecuperacion, resetContrasena } from "../Controladores/auth.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", login);
// POST /api/auth/register
router.post("/register", register);
// POST /api/auth/recover -> genera token
router.post("/recover", solicitarRecuperacion);
// POST /api/auth/reset -> resetea contraseña
router.post("/reset", resetContrasena);

export default router;
