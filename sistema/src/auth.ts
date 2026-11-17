import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const SEGREDO = process.env.JWT_SECRET || 'segredo-saep-clinica-vet';
export const EXPIRACAO = '30m'; // token expira em 30 minutos

export interface AuthRequest extends Request {
  usuarioId?: number;
}

// Middleware: exige token valido e não expirado
export function autenticar(req: AuthRequest, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : '';
  try {
    const dados = jwt.verify(token, SEGREDO) as { id: number };
    req.usuarioId = dados.id;
    next();
  } catch {
    res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
}

// Captura erros de funcoes async e responde com o status adequado
export const tratar =
  (fn: (req: AuthRequest, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res) => {
    fn(req, res).catch((e: any) => {
      const msg = String(e.message || '');
      if (msg.includes('FOREIGN KEY') && req.method === 'DELETE')
        return res.status(409).json({ erro: 'Registro possui vínculos e não pode ser excluído.' });
      if (msg.includes('UNIQUE'))
        return res.status(409).json({ erro: 'Registro duplicado (CPF ou e-mail já cadastrado).' });
      if (msg.includes('FOREIGN KEY'))
        return res.status(400).json({ erro: 'Referência inválida (tutor ou pet inexistente).' });
      console.error(e);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    });
  };
