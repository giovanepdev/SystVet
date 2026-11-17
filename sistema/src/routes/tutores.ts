import { Router } from 'express';
import { pool } from '../db';
import { tratar } from '../auth';
import { criptografar, descriptografar, hashCpf, mascarar } from '../cripto';

const r = Router();

const soDigitos = (v: unknown) => String(v).replace(/\D/g, '');

function validar(b: any): string | null {
  if (!b.nome || !b.cpf || !b.telefone) return 'Nome, CPF e telefone são obrigatórios.';
  if (soDigitos(b.cpf).length !== 11) return 'CPF deve ter 11 dígitos.';
  return null;
}

// LGPD: o CPF fica criptografado no banco e é mascarado na listagem
r.get('/', tratar(async (_req, res) => {
  const [t]: any = await pool.query(
    'SELECT id, nome, cpf, telefone, email, endereco FROM tutores ORDER BY nome');
  res.json(t.map((x: any) => ({ ...x, cpf: mascarar(descriptografar(x.cpf)) })));
}));

// Detalhe (usado na edição): devolve o CPF completo, descriptografado
r.get('/:id', tratar(async (req, res) => {
  const [t]: any = await pool.query(
    'SELECT id, nome, cpf, telefone, email, endereco FROM tutores WHERE id = ?', [req.params.id]);
  if (!t[0]) return res.status(404).json({ erro: 'Tutor não encontrado.' });
  res.json({ ...t[0], cpf: descriptografar(t[0].cpf) });
}));

r.post('/', tratar(async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, cpf, telefone, email, endereco } = req.body;
  const limpo = soDigitos(cpf);
  const [ins]: any = await pool.query(
    'INSERT INTO tutores (nome, cpf, cpf_hash, telefone, email, endereco) VALUES (?,?,?,?,?,?)',
    [nome, criptografar(limpo), hashCpf(limpo), telefone, email || null, endereco || null]);
  res.status(201).json({ id: ins.insertId });
}));

r.put('/:id', tratar(async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { nome, cpf, telefone, email, endereco } = req.body;
  const limpo = soDigitos(cpf);
  await pool.query(
    'UPDATE tutores SET nome=?, cpf=?, cpf_hash=?, telefone=?, email=?, endereco=? WHERE id=?',
    [nome, criptografar(limpo), hashCpf(limpo), telefone, email || null, endereco || null, req.params.id]);
  res.json({ ok: true });
}));

r.delete('/:id', tratar(async (req, res) => {
  await pool.query('DELETE FROM tutores WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

export default r;
