import { Pool } from "pg";
import 'dotenv/config';


// Database cloud (Supabase) wajib SSL; Postgres lokal nggak support SSL.
// Jadi patokannya: kalau host-nya localhost -> matiin SSL, selain itu -> nyalain.
const dbUrl = process.env.DATABASE_URL || '';
const isLocalDb = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

const pool = new Pool ({
    connectionString: dbUrl,
    ssl: isLocalDb ? false : { rejectUnauthorized: false },
})

export default pool;