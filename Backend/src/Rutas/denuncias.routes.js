import { Router } from 'express';
import { crear, listarPorUsuario } from '../Controladores/denuncias.controller.js';
import { authMiddleware } from '../Middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, crear);
router.get('/usuario/:usuario_id', listarPorUsuario);

export default router;
