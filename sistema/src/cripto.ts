import crypto from 'crypto';

// Chave de criptografia dos dados pessoais (LGPD). Em produção, definir CPF_KEY no ambiente.
const SEGREDO = process.env.CPF_KEY || 'saep-clinica-vet-chave-cpf';
const CHAVE = crypto.createHash('sha256').update(SEGREDO).digest(); // 32 bytes (AES-256)

// Criptografa o CPF com AES-256-GCM. Formato salvo no banco: iv:tag:dados (hexadecimal)
export function criptografar(texto: string): string {
  const iv = crypto.randomBytes(12);
  const cifra = crypto.createCipheriv('aes-256-gcm', CHAVE, iv);
  const dados = Buffer.concat([cifra.update(texto, 'utf8'), cifra.final()]);
  return [iv, cifra.getAuthTag(), dados].map((b) => b.toString('hex')).join(':');
}

export function descriptografar(salvo: string): string {
  const [iv, tag, dados] = salvo.split(':').map((h) => Buffer.from(h, 'hex'));
  const decifra = crypto.createDecipheriv('aes-256-gcm', CHAVE, iv);
  decifra.setAuthTag(tag);
  return Buffer.concat([decifra.update(dados), decifra.final()]).toString('utf8');
}

// Hash fixo do CPF: serve para garantir CPF único e para buscas, sem expor o número
export function hashCpf(cpf: string): string {
  return crypto.createHmac('sha256', CHAVE).update(cpf).digest('hex');
}

// Exibição: ***.456.789-**
export const mascarar = (cpf: string) => cpf.replace(/^\d{3}(\d{3})(\d{3})\d{2}$/, '***.$1.$2-**');
