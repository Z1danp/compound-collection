import pool from '../db/pool.js';

export async function addCompound(req, res) {
  const { compound, tags = [] } = req.body;
  const userId = req.user.userId;

  if (!compound?.name?.trim() || !compound?.smiles?.trim()) {
    return res.status(400).json({ error: 'Nama dan SMILES wajib diisi' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const compoundResult = await client.query(
      `INSERT INTO compounds (user_id, name, smiles, notes, is_favorite)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, smiles, notes, is_favorite, created_at, updated_at`,
      [
        userId,
        compound.name.trim(),
        compound.smiles.trim(),
        compound.notes ?? null,
        compound.is_favorite ?? false,
      ]
    );
    const newCompound = compoundResult.rows[0];

    const tagRows = [];
    const compoundTagRows = [];

    for (const rawTagName of tags) {
      const tagName = rawTagName.trim();
      // handling array tag yang '' bisa langsung skip aja ke tag lain
      if (!tagName) continue;

      // upsert: kalau tag dengan nama itu udah ada milik user ini, pakai id-nya
      const tagResult = await client.query(
        `INSERT INTO tags (user_id, name)
         VALUES ($1, $2)
         ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id, name`,
        [userId, tagName]
      );
      const tag = tagResult.rows[0];
      tagRows.push(tag);

      const compoundTagResult = await client.query(
        `INSERT INTO compound_tags (compound_id, tag_id)
         VALUES ($1, $2)
         RETURNING compound_id, tag_id`,
        [newCompound.id, tag.id]
      );
      compoundTagRows.push(compoundTagResult.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      compound: newCompound,
      tags: tagRows,
      compoundTags: compoundTagRows,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('addCompound:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

export async function updateCompound(req, res) {
  const { compound, tags = [] } = req.body;
  const userId = req.user.userId;

  if (!compound?.name?.trim() || !compound?.smiles?.trim()) {
    return res.status(400).json({ error: 'Nama dan SMILES wajib diisi' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const compoundResult = await client.query(
      `UPDATE compounds SET name = $3, smiles = $4, notes = $5, is_favorite = $6
      WHERE user_id = $1 AND id = $2
      RETURNING id, name, smiles, notes, is_favorite`,
      [
        userId,
        compound.id,
        compound.name.trim(),
        compound.smiles.trim(),
        compound.notes ?? null,
        compound.is_favorite ?? false,
      ]
    );

    const newCompound = compoundResult.rows[0];

    const tagRows = [];
    const compoundTagRows = [];

    for (const rawTagName of tags) {
      const tagName = rawTagName.trim();
      if (!tagName) continue;

      const tagResult = await client.query(
        `INSERT INTO tags (user_id, name)
         VALUES ($1, $2)
         ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id, name`,
        [userId, tagName]
      );

      const tag = tagResult.rows[0];
      tagRows.push(tag);

      const compoundTagResult = await client.query(
        `INSERT INTO compound_tags(compound_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT (compound_id, tag_id) DO UPDATE SET compound_id = $1, tag_id = $2
        RETURNING compound_id, tag_id
        `,
        [newCompound.id, tag.id]
      );

      compoundTagRows.push(compoundTagResult.rows[0]);
    }

    await client.query('COMMIT');

    res.status(200).json({
      compound: newCompound,
      tags: tagRows,
      compoundTags: compoundTagRows,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('updateCompound:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

export async function removeTag(req, res) {
  const { compound, tag} = req.body;
  const userId = req.user.userId;
  try {
    // const tagsResult = [];
    // for (const tag of tags) {
      const compoundsResult = await pool.query(
        `DELETE FROM compound_tags
        WHERE tag_id IN (SELECT id FROM tags WHERE name = $2 AND user_id = $1) 
        AND compound_id IN (SELECT id FROM compounds WHERE id = $3 AND user_id = $1)
        RETURNING *
      `,
        [userId, tag, compound.id]
      );
      // tagsResult.push(compoundsResult);
      const tagsResult = compoundsResult.rows[0]
    // }
    res.status(200).json({
      compound,
      tagsResult,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteCompound(req, res) {
  try {
    const compoundsResult = await pool.query(
      `DELETE FROM compounds
      WHERE id = $1 AND user_id = $2
      RETURNING *`,
      [req.body.id, req.user.userId]
    );

    res.status(200).json({
      compoundsResult,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

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
