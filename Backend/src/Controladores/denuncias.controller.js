import { crearDenuncia, listarDenunciasPorUsuario } from "../Modelos/denuncias.model.js";
import { generarIdIncidencia } from "../Modelos/incidencias.model.js";

export const crear = async (req, res) => {
  try {
    const data = req.body;
    const id = await generarIdIncidencia('D');
    const fecha = new Date();
    // Si el usuario está autenticado, usar su id como denunciante
    const denunciante_id = req.user?.id || data.denunciante_id;
    const creado = await crearDenuncia({ ...data, id, fecha, denunciante_id });
    return res.status(201).json({ ok: true, mensaje: 'Denuncia creada', incidencia: creado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};

export const listarPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const lista = await listarDenunciasPorUsuario(usuario_id);
    return res.json({ ok: true, denuncias: lista });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error del servidor' });
  }
};
