const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');
const auth    = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const uid = req.userId;
  try {
    const [totalResult, weekResult, last7Result, byTypeResult, bestsResult, streakResult] = await Promise.all([
      pool.query(
        'SELECT COUNT(*) AS total, COALESCE(SUM(duration_minutes),0) AS total_minutes FROM workouts WHERE user_id=$1',
        [uid]
      ),
      pool.query(
        `SELECT COUNT(*) AS this_week FROM workouts
         WHERE user_id=$1 AND workout_date >= CURRENT_DATE - INTERVAL '6 days'`,
        [uid]
      ),
      pool.query(
        `SELECT workout_date::date AS date, COUNT(*) AS count
         FROM workouts WHERE user_id=$1 AND workout_date >= CURRENT_DATE - INTERVAL '6 days'
         GROUP BY workout_date::date ORDER BY date`,
        [uid]
      ),
      pool.query(
        'SELECT activity_type, COUNT(*) AS count FROM workouts WHERE user_id=$1 GROUP BY activity_type ORDER BY count DESC',
        [uid]
      ),
      pool.query(
        'SELECT activity_type, MAX(duration_minutes) AS best_minutes FROM workouts WHERE user_id=$1 GROUP BY activity_type ORDER BY best_minutes DESC',
        [uid]
      ),
      pool.query(
        `SELECT workout_date::date AS d FROM workouts WHERE user_id=$1 GROUP BY d ORDER BY d DESC`,
        [uid]
      ),
    ]);

    /* Calculate current streak */
    let streak = 0;
    const days = streakResult.rows.map((r) => r.d.toISOString().slice(0, 10));
    if (days.length) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let cursor = new Date(today);
      for (const day of days) {
        const cursorStr = cursor.toISOString().slice(0, 10);
        if (day === cursorStr) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        } else if (streak === 0 && day === new Date(today.getTime() - 86400000).toISOString().slice(0, 10)) {
          streak++;
          cursor.setDate(cursor.getDate() - 2);
        } else {
          break;
        }
      }
    }

    res.json({
      total:         parseInt(totalResult.rows[0].total),
      total_minutes: parseInt(totalResult.rows[0].total_minutes),
      this_week:     parseInt(weekResult.rows[0].this_week),
      last7days:     last7Result.rows,
      by_type:       byTypeResult.rows,
      personal_bests: bestsResult.rows,
      streak,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
