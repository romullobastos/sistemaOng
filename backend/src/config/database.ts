import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente do arquivo config.env
dotenv.config({ path: path.join(__dirname, '../../config.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sistema_ong',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
