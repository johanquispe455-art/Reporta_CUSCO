import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cusco_secret_please_change';

export const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return res.status(401).json({ ok: false, mensaje: 'No token provided' });

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ ok: false, mensaje: 'Formato de token inválido' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido' });
  }
};
