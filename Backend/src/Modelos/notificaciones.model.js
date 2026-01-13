import { pool } from '../conexionBD.js';

export const crearNotificacion = async ({ usuario_id, mensaje, fecha }) => {
  const q = `INSERT INTO notificaciones (usuario_id, mensaje, fecha) VALUES ($1,$2,$3) RETURNING id, usuario_id, mensaje, fecha`;
  const r = await pool.query(q, [usuario_id, mensaje, fecha]);
  return r.rows[0];
};

export const listarNotificacionesPorUsuario = async (usuario_id) => {
  const q = `SELECT id, usuario_id, mensaje, leido, fecha FROM notificaciones WHERE usuario_id = $1 ORDER BY fecha DESC`;
  const r = await pool.query(q, [usuario_id]);
  return r.rows;
};

export const marcarNotificacionLeida = async (id) => {
  const q = `UPDATE notificaciones SET leido = true WHERE id = $1`;
  await pool.query(q, [id]);
};
