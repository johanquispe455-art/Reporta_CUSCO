import { pool } from "../conexionBD.js";

export const crearIncidenciaBase = async ({ id, descripcion, fecha, direccion, latitud, longitud, tipo_incidente_id, estado, prioridad, placa_vehiculo }) => {
  const q = `
    INSERT INTO incidencias (id, descripcion, fecha, direccion, latitud, longitud, tipo_incidente_id, estado, prioridad, placa_vehiculo)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING id
  `;
  const r = await pool.query(q, [id, descripcion, fecha, direccion, latitud, longitud, tipo_incidente_id, estado, prioridad, placa_vehiculo]);
  return r.rows[0];
};

export const generarIdIncidencia = async (tipo) => {
  // tipo: 'D' para denuncia, 'R' para reporte
  const year = new Date().getFullYear();
  const prefix = tipo === 'D' ? 'D' : 'R';
  const like = `${prefix}-${year}-%`;
  const q = `SELECT COUNT(*)::int AS cnt FROM incidencias WHERE id LIKE $1`;
  const r = await pool.query(q, [like]);
  const n = r.rows[0].cnt + 1;
  const padded = String(n).padStart(6, '0');
  return `${prefix}-${year}-${padded}`;
};

export const obtenerTipos = async () => {
  const q = `SELECT id, nombre, puntos, es_predefinido FROM tipos_incidentes ORDER BY nombre`;
  const r = await pool.query(q);
  return r.rows;
};
