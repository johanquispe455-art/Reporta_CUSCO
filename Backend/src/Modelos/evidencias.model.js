import { pool } from '../conexionBD.js';

export const crearEvidencia = async ({ incidencia_id, tipo_archivo, nombre_archivo, url }) => {
  const q = `INSERT INTO evidencias (incidencia_id, tipo_archivo, nombre_archivo, url) VALUES ($1,$2,$3,$4) RETURNING id, incidencia_id, url`;
  const r = await pool.query(q, [incidencia_id, tipo_archivo, nombre_archivo, url]);
  return r.rows[0];
};

export const listarEvidenciasPorIncidencia = async (incidencia_id) => {
  const q = `SELECT id, incidencia_id, tipo_archivo, nombre_archivo, url FROM evidencias WHERE incidencia_id = $1`;
  const r = await pool.query(q, [incidencia_id]);
  return r.rows;
};
