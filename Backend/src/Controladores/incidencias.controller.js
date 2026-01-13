import { generarIdIncidencia, obtenerTipos } from "../Modelos/incidencias.model.js";

export const getTipos = async (req, res) => {
  try {
    const tipos = await obtenerTipos();
    return res.json({ ok: true, tipos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};

export const generarId = async (req, res) => {
  try {
    const { tipo } = req.query; // 'D' o 'R'
    const id = await generarIdIncidencia(tipo === 'D' ? 'D' : 'R');
    return res.json({ ok: true, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};
