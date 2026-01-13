import { pool } from "../conexionBD.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const buscarUsuarioPorCorreo = async (correo) => {
  const query = `
    SELECT id, dni, nombre_completo, telefono, direccion, correo, contrasena_hash, rol
    FROM usuarios
    WHERE correo = $1
  `;
  const result = await pool.query(query, [correo]);
  return result.rows[0];
};

export const buscarUsuarioPorId = async (id) => {
  const q = `SELECT id, dni, nombre_completo, telefono, direccion, correo, rol FROM usuarios WHERE id = $1`;
  const r = await pool.query(q, [id]);
  return r.rows[0];
};

const generarPrefijoUsuario = (rol) => (rol === "admin" ? "A" : "C");

export const generarNuevoIdUsuario = async (rol) => {
  const prefix = generarPrefijoUsuario(rol);
  // Contar usuarios del mismo prefijo
  const q = `SELECT COUNT(*)::int AS cnt FROM usuarios WHERE id LIKE $1`;
  const like = `${prefix}%`;
  const r = await pool.query(q, [like]);
  const n = r.rows[0].cnt + 1;
  const padded = String(n).padStart(6, "0");
  return `${prefix}${padded}`;
};

export const crearUsuario = async ({ dni, nombre_completo, telefono, direccion, correo, contrasena, rol }) => {
  const id = await generarNuevoIdUsuario(rol);
  // Hashear la contraseña antes de guardar
  const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

  const q = `
    INSERT INTO usuarios (id, dni, nombre_completo, telefono, direccion, correo, contrasena_hash, rol)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id, correo, rol
  `;

  const r = await pool.query(q, [id, dni, nombre_completo, telefono, direccion, correo, contrasena_hash, rol]);
  return r.rows[0];
};

export const crearTokenRecuperacion = async (correo) => {
  const token = crypto.randomBytes(20).toString("hex");
  const expiracion = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  const q = `
    INSERT INTO recuperacion_contrasena (correo, token, expiracion, usado)
    VALUES ($1,$2,$3,false)
    RETURNING id, token, expiracion
  `;

  const r = await pool.query(q, [correo, token, expiracion]);
  return r.rows[0];
};

export const buscarTokenRecuperacion = async (correo, token) => {
  const q = `SELECT * FROM recuperacion_contrasena WHERE correo = $1 AND token = $2 AND usado = false`;
  const r = await pool.query(q, [correo, token]);
  return r.rows[0];
};

export const marcarTokenUsado = async (id) => {
  const q = `UPDATE recuperacion_contrasena SET usado = true WHERE id = $1`;
  await pool.query(q, [id]);
};

export const actualizarContrasena = async (correo, nuevaContrasena) => {
  const hash = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS);
  const q = `UPDATE usuarios SET contrasena_hash = $1 WHERE correo = $2 RETURNING id`;
  const r = await pool.query(q, [hash, correo]);
  return r.rows[0];
};

export default null;
