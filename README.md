# Clínica Veterinária - SAEP (SENAI)

Sistema web para cadastro e gerenciamento de **tutores**, **pets** e **agendamentos**, com login (sessão de 30 minutos) e proteção de dados pessoais (LGPD).

**Tecnologias:** HTML, CSS, JavaScript, Node.js + Express (TypeScript) e SQLite.

## Estrutura

| Item | Descrição |
|---|---|
| `sistema/` | Código-fonte (back-end em `src/`, front-end em `public/`) |
| `saep_db.sql` | Script de criação e população do banco |
| `der.png` | Diagrama Entidade-Relacionamento |
| `documentacao.pdf` | Documentação do software |

## Como executar

Não precisa instalar banco de dados: na primeira execução o sistema cria o arquivo `sistema/saep.db` lendo o `saep_db.sql`. Para recriar o banco, apague o `saep.db`.

```bash
cd sistema
npm install
npm start
```

Acesse `http://localhost:3000` e entre com `admin@clinica.com` / `admin123`.

Logins de teste: `admin@clinica.com` / `admin123`, `vet@clinica.com` / `vet12345`, `recep@clinica.com` / `recep123`.

## Autor

Giovane Pereira dos Santos
