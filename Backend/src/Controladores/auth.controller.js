import { buscarUsuarioPorCorreo, crearUsuario, crearTokenRecuperacion, buscarTokenRecuperacion, marcarTokenUsado, actualizarContrasena } from "../Modelos/usuario.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'cusco_secret_please_change';

// LOGIN
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: "Correo y contraseña obligatorios" });
    }

    const usuario = await buscarUsuarioPorCorreo(correo);
    if (!usuario) return res.status(401).json({ ok: false, mensaje: "Usuario no encontrado" });

    const match = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!match) return res.status(401).json({ ok: false, mensaje: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ ok: true, mensaje: "Login correcto", rol: usuario.rol, usuario_id: usuario.id, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error del servidor" });
  }
};

// REGISTRO
export const register = async (req, res) => {
  try {
    const { dni, nombre_completo, telefono, direccion, correo, contrasena, rol = "ciudadano" } = req.body;
    if (!dni || !nombre_completo || !correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: "Faltan datos obligatorios" });
    }

    // Verificar existencia
    const existe = await buscarUsuarioPorCorreo(correo);
    if (existe) return res.status(409).json({ ok: false, mensaje: "Correo ya registrado" });

    const creado = await crearUsuario({ dni, nombre_completo, telefono, direccion, correo, contrasena, rol });
    return res.status(201).json({ ok: true, mensaje: "Usuario creado", usuario: creado });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error del servidor" });
  }
};

// SOLICITAR RECUPERACION (genera token)
export const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ ok: false, mensaje: "Correo es requerido" });

    const usuario = await buscarUsuarioPorCorreo(correo);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: "Correo no registrado" });

    const tokenRow = await crearTokenRecuperacion(correo);

    // En un sistema real enviar por correo. Aquí devolvemos el token para pruebas.
    return res.json({ ok: true, mensaje: "Token creado", token: tokenRow.token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error del servidor" });
  }
};

// RESTABLECER CONTRASEÑA
export const resetContrasena = async (req, res) => {
  try {
    const { correo, token, nuevaContrasena } = req.body;
    if (!correo || !token || !nuevaContrasena) return res.status(400).json({ ok: false, mensaje: "Faltan datos" });

    const tokenRow = await buscarTokenRecuperacion(correo, token);
    if (!tokenRow) return res.status(400).json({ ok: false, mensaje: "Token inválido o usado" });

    const ahora = new Date();
    if (new Date(tokenRow.expiracion) < ahora) return res.status(400).json({ ok: false, mensaje: "Token expirado" });

    await actualizarContrasena(correo, nuevaContrasena);
    await marcarTokenUsado(tokenRow.id);

    return res.json({ ok: true, mensaje: "Contraseña actualizada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error del servidor" });
  }
};
