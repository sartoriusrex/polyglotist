import * as dotenv from 'dotenv';
dotenv.config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

export default pool;
