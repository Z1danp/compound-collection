import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './routes/renik.js';
import cookieParser from 'cookie-parser';
import pool from './db/pool.js';
import cron from 'node-cron';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/', router);

cron.schedule('0 3 * * *', async () => {
  try {
    const result = await pool.query(
      `DELETE FROM users
      WHERE is_guest = true
        AND created_at < NOW () - INTERVAL '1 minute';`
    );
    console.log(`Guest cleanup: ${result.rowCount} akun dihapus`);
  } catch (err) {
    console.error(`Guest cleanup gagal:`, err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening color your night`);
});
