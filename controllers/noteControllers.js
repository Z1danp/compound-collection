import pool from '../db/pool.js';

export async function getUserData(req, res) {
  try {
    const compoundsResult = await pool.query(
      `SELECT id, name, smiles, notes, is_favorite, created_at, updated_at
     FROM compounds
     WHERE user_id = $1
     ORDER BY created_at DESC`,
      [req.user.userId]
    );

    const tagsResult = await pool.query(
      `SELECT id, name FROM tags WHERE user_id = $1`,
      [req.user.userId]
    );

    const compoundTagsResult = await pool.query(
      `SELECT ct.compound_id, ct.tag_id
     FROM compound_tags ct
     JOIN compounds c ON c.id = ct.compound_id
     WHERE c.user_id = $1`,
      [req.user.userId]
    );

    res.json({
      compounds: compoundsResult.rows,
      tags: tagsResult.rows,
      compoundTags: compoundTagsResult.rows,
    });
  } catch (err) {
    console.error('getUserData:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
