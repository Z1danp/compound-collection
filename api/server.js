import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from '/routes/renik.js';
import cookieParser from 'cookie-parser';
import pool from '/db/pool.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// 1. Route Cron Job ditaruh di atas
app.get('/api/cron/cleanup-guests', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await pool.query(
      `DELETE FROM users WHERE is_guest = true
        AND created_at < NOW() - INTERVAL '1 day';`
    );
    console.log(`Guest cleanup: ${result.rowCount} akun dihapus`);
    return res.status(200).json({ success: true, deleted: result.rowCount });
  } catch (err) {
    console.error(`Guest cleanup gagal: ${err}`);
    return res.status(500).json({ error: err.message }); // Diperbaiki: err.message
  }
});

// 2. Main Routes
app.use('/', router);

// 3. Local Development Listener
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;