import { Router } from 'express';
import { getTipos, generarId } from '../Controladores/incidencias.controller.js';

const router = Router();

router.get('/tipos', getTipos);
router.get('/generar-id', generarId);

export default router;
