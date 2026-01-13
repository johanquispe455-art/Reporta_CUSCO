import { Router } from 'express';
import { crear, listarPorUsuario, marcarLeida } from '../Controladores/notificaciones.controller.js';

const router = Router();

router.post('/', crear);
router.get('/usuario/:usuario_id', listarPorUsuario);
router.post('/:id/leida', marcarLeida);

export default router;
