import { Router } from 'express';
import { pool } from '../db';
import { tratar, AuthRequest } from '../auth';

const r = Router();
const STATUS = ['Agendado', 'Concluído', 'Cancelado'];

// Converte "2026-11-25T09:00" para "2026-11-25 09:00:00"
const paraSql = (v: string) => v.replace('T', ' ').padEnd(19, ':00').slice(0, 19);

// Validação: campos obrigatórios + horário já ocupado por outro agendamento ativo
async function validar(b: any, idAtual = 0): Promise<string | null> {
  if (!b.pet_id || !b.data_hora || !b.motivo) return 'Pet, data/hora e motivo são obrigatórios.';
  if (b.status && !STATUS.includes(b.status)) return 'Status inválido.';
  if (b.status !== 'Cancelado') {
    const [c]: any = await pool.query(
      "SELECT id FROM agendamentos WHERE data_hora = ? AND status <> 'Cancelado' AND id <> ?",
      [paraSql(b.data_hora), idAtual]);
    if (c[0]) return 'Já existe um agendamento neste horário.';
  }
  return null;
}

r.get('/', tratar(async (_req, res) => {
  const [a] = await pool.query(
    `SELECT a.*, p.nome AS pet_nome, t.nome AS tutor_nome
       FROM agendamentos a
       JOIN pets p ON p.id = a.pet_id
       JOIN tutores t ON t.id = p.tutor_id
      ORDER BY a.data_hora`);
  res.json(a);
}));

r.get('/:id', tratar(async (req, res) => {
  const [a]: any = await pool.query('SELECT * FROM agendamentos WHERE id = ?', [req.params.id]);
  if (!a[0]) return res.status(404).json({ erro: 'Agendamento não encontrado.' });
  res.json(a[0]);
}));

r.post('/', tratar(async (req: AuthRequest, res) => {
  const erro = await validar(req.body);
  if (erro) return res.status(409).json({ erro });
  const { pet_id, data_hora, motivo, status } = req.body;
  const [ins]: any = await pool.query(
    'INSERT INTO agendamentos (pet_id, usuario_id, data_hora, motivo, status) VALUES (?,?,?,?,?)',
    [pet_id, req.usuarioId, paraSql(data_hora), motivo, status || 'Agendado']);
  res.status(201).json({ id: ins.insertId });
}));

// Salva as alteracoes no banco de dados
r.put('/:id', tratar(async (req, res) => {
  const erro = await validar(req.body, Number(req.params.id));
  if (erro) return res.status(409).json({ erro });
  const { pet_id, data_hora, motivo, status } = req.body;
  await pool.query(
    'UPDATE agendamentos SET pet_id=?, data_hora=?, motivo=?, status=? WHERE id=?',
    [pet_id, paraSql(data_hora), motivo, status || 'Agendado', req.params.id]);
  res.json({ ok: true });
}));

r.delete('/:id', tratar(async (req, res) => {
  await pool.query('DELETE FROM agendamentos WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

export default r;
