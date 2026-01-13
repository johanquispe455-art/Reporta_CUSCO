import { Router } from "express";
import { consultarDni } from "../Controladores/dni.controller.js";

const router = Router();

router.get("/dni/:dni", consultarDni);

export default router;
