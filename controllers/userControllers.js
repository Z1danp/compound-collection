import bcrypt from 'bcrypt';
import pool from '../db/pool.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

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
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email telah terdaftar' });
    }
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, name, email, password_hash, is_guest FROM users WHERE email=$1',
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Email atau Password salah' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, isGuest: user.is_guest },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000
    }
    )

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      is_guest: user.is_guest,
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}
