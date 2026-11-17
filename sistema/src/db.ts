import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

// Arquivo do banco (criado automaticamente na 1ª execução) e script de criação
const ARQUIVO_DB = path.join(__dirname, '..', 'saep.db');
const ARQUIVO_SQL = path.join(__dirname, '..', '..', 'saep_db.sql');
const bancoNovo = !fs.existsSync(ARQUIVO_DB);

const db = new sqlite3.Database(ARQUIVO_DB);
db.run('PRAGMA foreign_keys = ON'); // faz o SQLite respeitar as chaves estrangeiras

// Na primeira execução, roda o saep_db.sql (cria as tabelas + dados de exemplo)
export const pronto = new Promise<void>((ok, erro) => {
  if (!bancoNovo) return ok();
  db.exec(fs.readFileSync(ARQUIVO_SQL, 'utf8'), (e) => {
    if (e) return erro(e);
    console.log('Banco criado a partir do saep_db.sql');
    ok();
  });
});

// Interface simples: query(sql, parametros) -> [linhas] (SELECT) ou [{ insertId }] (demais comandos)
export const pool = {
  query(sql: string, params: unknown[] = []): Promise<[any]> {
    return new Promise((ok, erro) => {
      if (/^\s*select/i.test(sql)) {
        db.all(sql, params, (e, linhas) => (e ? erro(e) : ok([linhas])));
      } else {
        db.run(sql, params, function (e) {
          if (e) return erro(e);
          ok([{ insertId: this.lastID, affectedRows: this.changes }]);
        });
      }
    });
  },
};
