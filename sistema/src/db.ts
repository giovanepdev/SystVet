import mysql from 'mysql2/promise';

// Conexao com o MySQL (ajuste usuario/senha se necessario)
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'saep_db',
  dateStrings: true,
});
