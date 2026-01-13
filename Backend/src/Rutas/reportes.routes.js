import { Router } from 'express';
import { crear, listar } from '../Controladores/reportes.controller.js';

const router = Router();

router.post('/', crear);
router.get('/', listar);

export default router;
