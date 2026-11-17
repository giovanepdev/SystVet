import { Router } from 'express';
import { pool } from '../db';
import { tratar } from '../auth';

const r = Router();

// LGPD: na listagem o CPF e mascarado (***.456.789-**)
const mascarar = (cpf: string) => cpf.replace(/^\d{3}(\d{3})(\d{3})\d{2}$/, '***.$1.$2-**');
const soDigitos = (v: unknown) => String(v).replace(/\D/g, '');

function validar(b: any): string | null {
  if (!b.nome || !b.cpf || !b.telefone) return 'Nome, CPF e telefone são obrigatórios.';
  if (soDigitos(b.cpf).length !== 11) return 'CPF deve ter 11 dígitos.';
  return null;
}

r.get('/', tratar(async (_req, res) => {
  const [t]: any = await pool.query('SELECT * FROM tutores ORDER BY nome');
  res.json(t.map((x: any) => ({ ...x, cpf: mascarar(x.cpf) })));
}));

// Detalhe (usado na edicao): devolve o CPF completo
r.get('/:id', tratar(async (req, res) => {
  const [t]: any = await pool.query('SELECT * FROM tutores WHERE id = ?', [req.params.id]);
  if (!t[0]) return res.status(404).json({ erro: 'Tutor não encontrado.' });
  res.json(t[0]);
}));

r.post('/', tratar(async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, cpf, telefone, email, endereco } = req.body;
  const [ins]: any = await pool.query(
    'INSERT INTO tutores (nome, cpf, telefone, email, endereco) VALUES (?,?,?,?,?)',
    [nome, soDigitos(cpf), telefone, email || null, endereco || null]);
  res.status(201).json({ id: ins.insertId });
}));

r.put('/:id', tratar(async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, cpf, telefone, email, endereco } = req.body;
  await pool.query(
    'UPDATE tutores SET nome=?, cpf=?, telefone=?, email=?, endereco=? WHERE id=?',
    [nome, soDigitos(cpf), telefone, email || null, endereco || null, req.params.id]);
  res.json({ ok: true });
}));

r.delete('/:id', tratar(async (req, res) => {
  await pool.query('DELETE FROM tutores WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

export default r;
