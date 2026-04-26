const express  = require('express');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const pool      = require('../db/pool');
const router    = express.Router();

function makeToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, displayName: user.display_name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

/* POST /api/auth/signup */
router.post('/signup', async (req, res) => {
  try {
    const { display_name, email, password } = req.body;
    if (!display_name || !email || !password)
      return res.status(400).json({ error: 'All fields are required.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length)
      return res.status(409).json({ error: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (display_name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, display_name, email, weekly_goal, unit`,
      [display_name.trim(), email.toLowerCase(), hash]
    );
    const user = result.rows[0];
    res.status(201).json({ token: makeToken(user), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST /api/auth/login */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required.' });

    const result = await pool.query(
      'SELECT id, display_name, email, password_hash, weekly_goal, unit FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (!result.rows.length)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const { password_hash, ...safeUser } = user;
    res.json({ token: makeToken(safeUser), user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT /api/auth/profile  (update display_name, weekly_goal, unit) */
const auth = require('../middleware/auth');
router.put('/profile', auth, async (req, res) => {
  try {
    const { display_name, weekly_goal, unit } = req.body;
    const result = await pool.query(
      `UPDATE users SET display_name=$1, weekly_goal=$2, unit=$3
       WHERE id=$4 RETURNING id, display_name, email, weekly_goal, unit`,
      [display_name, parseInt(weekly_goal) || 3, unit || 'metric', req.userId]
    );
    const user = result.rows[0];
    res.json({ token: makeToken(user), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
