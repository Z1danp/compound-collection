import bcrypt from 'bcrypt';
import pool from '../db/pool.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { TUTORIAL_COMPOUNDS } from '../data/tutorialCompounds.js';

const SALT_ROUNDS = 12;

// nama tag yang nempel di tiap tutorial — ganti di sini kalau mau kata lain
const TUTORIAL_TAG = 'Panduan SMILES';

// seed senyawa contoh (pengenalan SMILES) ke user yang baru dibuat.
// pakai `client` yang sama dengan pemanggilnya biar ikut satu transaksi:
// kalau salah satu insert gagal, pembuatan user pun ikut di-rollback.
async function seedTutorialCompounds(client, userId) {
  // buat tag-nya sekali untuk user ini, lalu pakai id-nya buat semua tutorial.
  // ON CONFLICT cuma jaga-jaga (user baru belum punya tag ini), samain gaya
  // dengan addCompound
  const tagResult = await client.query(
    `INSERT INTO tags (user_id, name)
     VALUES ($1, $2)
     ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [userId, TUTORIAL_TAG]
  );
  const tagId = tagResult.rows[0].id;

  for (const tutorial of TUTORIAL_COMPOUNDS) {
    const compoundResult = await client.query(
      `INSERT INTO compounds (user_id, name, smiles, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, tutorial.name, tutorial.smiles, tutorial.notes]
    );
    const compoundId = compoundResult.rows[0].id;

    await client.query(
      `INSERT INTO compound_tags (compound_id, tag_id)
       VALUES ($1, $2)`,
      [compoundId, tagId]
    );
  }
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: `Nama, email, dan password wajib diisi` });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await client.query(
      `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );
    const user = result.rows[0];

    // begitu user jadi, langsung isi koleksinya dengan tutorial SMILES
    await seedTutorialCompounds(client, user.id);

    await client.query('COMMIT');

    res.status(201).json({ user });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email telah terdaftar' });
    }
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  } finally {
    client.release();
  }
}

export async function getMe(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, is_guest FROM users WHERE id = $1',
      [req.user.userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // query user ke db
    const result = await pool.query(
      'SELECT id, name, email, password_hash, is_guest FROM users WHERE email=$1',
      [email]
    );
    const user = result.rows[0];
    // validation kalo user ga ketemu di db
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Email atau Password salah' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, isGuest: user.is_guest },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // kirim jwt ke cookie browser
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    // kirim info user setelah sukses login
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

export async function guestLogin(req, res) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const email = `guest_${crypto.randomUUID()}@guest.com`;
    const name = 'guest';
    const isGuest = true;
    const password = process.env.JWT_SECRET;
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await client.query(
      `INSERT INTO users (name, email, password_hash, is_guest)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, is_guest`,
      [name, email, password_hash, isGuest]
    );

    const userGuest = result.rows[0];

    // guest juga dapet tutorial yang sama; ikut kehapus otomatis (ON DELETE
    // CASCADE) waktu row guest-nya dibersihkan cron nanti
    await seedTutorialCompounds(client, userGuest.id);

    await client.query('COMMIT');

    const token = jwt.sign(
      { userId: userGuest.id, isGuest: userGuest.is_guest },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    // kirim info user setelah sukses login
    res.json({
      id: userGuest.id,
      name: userGuest.name,
      email: userGuest.email,
      is_guest: userGuest.is_guest,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  } finally {
    client.release();
  }
}

export async function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.json({
    message: 'Logout success',
  });
}
