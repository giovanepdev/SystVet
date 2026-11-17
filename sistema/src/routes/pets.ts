import { Router } from 'express';
import { pool } from '../db';
import { tratar } from '../auth';

const r = Router();

// Regra de negocio: todo pet deve estar associado a um tutor existente
async function validar(b: any): Promise<string | null> {
  if (!b.nome || !b.especie) return 'Nome e espécie são obrigatórios.';
  if (!b.tutor_id) return 'Todo pet deve ser associado a um tutor.';
  const [t]: any = await pool.query('SELECT id FROM tutores WHERE id = ?', [b.tutor_id]);
  if (!t[0]) return 'Tutor informado não existe.';
  return null;
}

r.get('/', tratar(async (_req, res) => {
  const [p] = await pool.query(
    'SELECT p.*, t.nome AS tutor_nome FROM pets p JOIN tutores t ON t.id = p.tutor_id ORDER BY p.nome');
  res.json(p);
}));

r.get('/:id', tratar(async (req, res) => {
  const [p]: any = await pool.query('SELECT * FROM pets WHERE id = ?', [req.params.id]);
  if (!p[0]) return res.status(404).json({ erro: 'Pet não encontrado.' });
  res.json(p[0]);
}));

r.post('/', tratar(async (req, res) => {
  const erro = await validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, especie, raca, data_nascimento, tutor_id } = req.body;
  const [ins]: any = await pool.query(
    'INSERT INTO pets (nome, especie, raca, data_nascimento, tutor_id) VALUES (?,?,?,?,?)',
    [nome, especie, raca || null, data_nascimento || null, tutor_id]);
  res.status(201).json({ id: ins.insertId });
}));

r.put('/:id', tratar(async (req, res) => {
  const erro = await validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, especie, raca, data_nascimento, tutor_id } = req.body;
  await pool.query(
    'UPDATE pets SET nome=?, especie=?, raca=?, data_nascimento=?, tutor_id=? WHERE id=?',
    [nome, especie, raca || null, data_nascimento || null, tutor_id, req.params.id]);
  res.json({ ok: true });
}));

r.delete('/:id', tratar(async (req, res) => {
  await pool.query('DELETE FROM pets WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

export default r;
