import { crearIncidenciaBase } from './incidencias.model.js';
import { pool } from '../conexionBD.js';

export const crearDenuncia = async ({ descripcion, fecha, direccion, latitud, longitud, tipo_incidente_id, estado, prioridad, placa_vehiculo, denunciante_id, denunciado_nombre, denunciado_dni, id }) => {
  // Inserta base
  await crearIncidenciaBase({ id, descripcion, fecha, direccion, latitud, longitud, tipo_incidente_id, estado, prioridad, placa_vehiculo });

  const q = `
    INSERT INTO denuncias (id, denunciante_id, denunciado_nombre, denunciado_dni)
    VALUES ($1,$2,$3,$4)
    RETURNING denunciante_id
  `;
  const r = await pool.query(q, [id, denunciante_id, denunciado_nombre, denunciado_dni]);
  return { id, denunciante_id: r.rows[0].denunciante_id };
};

export const listarDenunciasPorUsuario = async (usuario_id) => {
  const q = `SELECT d.*, i.descripcion, i.fecha FROM denuncias d JOIN incidencias i ON d.id = i.id WHERE d.denunciante_id = $1 ORDER BY i.fecha DESC`;
  const r = await pool.query(q, [usuario_id]);
  return r.rows;
};
