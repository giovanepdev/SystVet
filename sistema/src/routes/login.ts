import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { SEGREDO, EXPIRACAO, tratar } from '../auth';

const r = Router();

r.post('/', tratar(async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha.' });

  const [linhas]: any = await pool.query('SELECT id, nome, senha_hash FROM usuarios WHERE email = ?', [email]);
  const usuario = linhas[0];
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash)))
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

  const token = jwt.sign({ id: usuario.id }, SEGREDO, { expiresIn: EXPIRACAO });
  res.json({ token, nome: usuario.nome });
}));

export default r;
