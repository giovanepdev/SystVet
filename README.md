# Clínica Veterinária - SAEP (SENAI)

Sistema web para cadastro e gerenciamento de **tutores**, **pets** e **agendamentos**, com login (sessão de 30 minutos) e proteção de dados pessoais (LGPD).

**Tecnologias:** HTML, CSS, JavaScript, Node.js + Express (TypeScript) e MySQL.

## Estrutura

| Item | Descrição |
|---|---|
| `sistema/` | Código-fonte (back-end em `src/`, front-end em `public/`) |
| `saep_db.sql` | Script de criação e população do banco |
| `der.png` | Diagrama Entidade-Relacionamento |
| `documentacao.pdf` | Documentação do software |

## Como executar

1. Execute o `saep_db.sql` no MySQL (Workbench: *File → Open SQL Script* e o raio).
2. Na pasta `sistema`:

```bash
npm install
```

3. Informe a senha do MySQL (PowerShell) e inicie:

```bash
$env:DB_PASS="SUA_SENHA"
npm start
```

4. Acesse `http://localhost:3000` e entre com `admin@clinica.com` / `admin123`.

Variáveis opcionais: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, `PORT`.

## Autor

Giovane Pereira dos Santos
