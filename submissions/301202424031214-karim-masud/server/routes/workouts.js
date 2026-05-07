const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');
const auth    = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { search, type } = req.query;
    const params = [req.userId];
    let query = 'SELECT * FROM workouts WHERE user_id = $1';

    if (search) {
      params.push(`%${search}%`);
      query += ` AND activity_name ILIKE $${params.length}`;
    }
    if (type && type !== 'All') {
      params.push(type);
      query += ` AND activity_type = $${params.length}`;
    }

    query += ' ORDER BY workout_date DESC, created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM workouts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { activity_name, activity_type, duration_minutes, workout_date, intensity, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO workouts (activity_name, activity_type, duration_minutes, workout_date, intensity, notes, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [activity_name, activity_type, parseInt(duration_minutes), workout_date, intensity, notes || null, req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { activity_name, activity_type, duration_minutes, workout_date, intensity, notes } = req.body;
    const result = await pool.query(
      `UPDATE workouts
       SET activity_name=$1, activity_type=$2, duration_minutes=$3, workout_date=$4, intensity=$5, notes=$6
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [activity_name, activity_type, parseInt(duration_minutes), workout_date, intensity, notes || null, req.params.id, req.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM workouts WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
