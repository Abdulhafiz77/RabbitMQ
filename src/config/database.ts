import { Pool } from 'pg';
import config from './config';

const pool = new Pool(config.db);

export const pgPoolQuery = async (sql: string, params?: any): Promise<any> => {
  try {
    const result = await pool.query(sql, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};