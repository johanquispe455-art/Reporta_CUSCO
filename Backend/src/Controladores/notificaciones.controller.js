import { crearNotificacion, listarNotificacionesPorUsuario, marcarNotificacionLeida } from '../Modelos/notificaciones.model.js';

export const crear = async (req, res) => {
  try {
    const { usuario_id, mensaje } = req.body;
    if (!usuario_id || !mensaje) return res.status(400).json({ ok: false, mensaje: 'Datos incompletos' });
    const fecha = new Date();
    const n = await crearNotificacion({ usuario_id, mensaje, fecha });
    return res.status(201).json({ ok: true, notificacion: n });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};

export const listarPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const lista = await listarNotificacionesPorUsuario(usuario_id);
    return res.json({ ok: true, notificaciones: lista });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};

export const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;
    await marcarNotificacionLeida(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};
