import bcrypt from 'bcrypt';
import pool from '../db/pool.js';

const SALT_ROUNDS = 12;

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: `Nama, email, dan password wajib diisi` });
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if ((err.code = '23505')) {
      return res.status(409).json({ error: 'Email telah terdaftar' });
    }
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}


