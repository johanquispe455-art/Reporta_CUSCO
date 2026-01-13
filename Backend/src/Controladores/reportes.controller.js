import { crearReporte, listarReportes } from "../Modelos/reportes.model.js";
import { generarIdIncidencia } from "../Modelos/incidencias.model.js";

export const crear = async (req, res) => {
  try {
    const data = req.body;
    const id = await generarIdIncidencia('R');
    const fecha = new Date();
    const creado = await crearReporte({ ...data, id, fecha });
    return res.status(201).json({ ok: true, mensaje: 'Reporte creado', incidencia: creado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};

export const listar = async (req, res) => {
  try {
    const lista = await listarReportes();
    return res.json({ ok: true, reportes: lista });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};
