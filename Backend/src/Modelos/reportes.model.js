import { crearIncidenciaBase } from './incidencias.model.js';
import { pool } from '../conexionBD.js';

export const crearReporte = async ({ descripcion, fecha, direccion, latitud, longitud, tipo_incidente_id, estado, prioridad, placa_vehiculo, es_anonimo = true, id }) => {
  await crearIncidenciaBase({ id, descripcion, fecha, direccion, latitud, longitud, tipo_incidente_id, estado, prioridad, placa_vehiculo });

  const q = `
    INSERT INTO reportes (id, es_anonimo)
    VALUES ($1,$2)
    RETURNING id
  `;
  const r = await pool.query(q, [id, es_anonimo]);
  return { id: r.rows[0].id };
};

export const listarReportes = async () => {
  const q = `SELECT r.*, i.descripcion, i.fecha FROM reportes r JOIN incidencias i ON r.id = i.id ORDER BY i.fecha DESC`;
  const r = await pool.query(q);
  return r.rows;
};
