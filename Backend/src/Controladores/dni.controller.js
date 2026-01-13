import { obtenerNombrePorDni } from "../Servicios/dniScraper.js";

export const consultarDni = async (req, res) => {
  const { dni } = req.params;

  if (!dni || dni.length !== 8) {
    return res.status(400).json({ ok: false, mensaje: "DNI inválido" });
  }

  const nombre = await obtenerNombrePorDni(dni);

  if (!nombre) {
    return res.json({ ok: false, mensaje: "DNI no encontrado" });
  }

  res.json({
    ok: true,
    nombre_completo: nombre.toUpperCase()
  });
};
