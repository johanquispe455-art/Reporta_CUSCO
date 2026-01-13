import { Router } from 'express';
import { crear, listarPorIncidencia } from '../Controladores/evidencias.controller.js';

const router = Router();

router.post('/', crear);
router.get('/incidencia/:incidencia_id', listarPorIncidencia);

export default router;
