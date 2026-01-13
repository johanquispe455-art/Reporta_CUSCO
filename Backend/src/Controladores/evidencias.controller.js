import { crearEvidencia, listarEvidenciasPorIncidencia } from '../Modelos/evidencias.model.js';

export const crear = async (req, res) => {
  try {
    const { incidencia_id, tipo_archivo, nombre_archivo, url } = req.body;
    if (!incidencia_id || !tipo_archivo || !url) return res.status(400).json({ ok: false, mensaje: 'Datos incompletos' });
    const ev = await crearEvidencia({ incidencia_id, tipo_archivo, nombre_archivo, url });
    return res.status(201).json({ ok: true, evidencia: ev });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};

export const listarPorIncidencia = async (req, res) => {
  try {
    const { incidencia_id } = req.params;
    const lista = await listarEvidenciasPorIncidencia(incidencia_id);
    return res.json({ ok: true, evidencias: lista });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};
