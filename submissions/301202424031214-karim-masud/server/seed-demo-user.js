require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function seedDemoUser() {
  console.log('Seeding demo user…');

  const hash = await bcrypt.hash('Demo1234', 10);

  const existing = await pool.query("SELECT id FROM users WHERE email='demo@fitflextrack.app'");
  let userId;
  if (existing.rows.length) {
    userId = existing.rows[0].id;
    console.log(`Demo user already exists (id=${userId}), linking workouts…`);
  } else {
    const res = await pool.query(
      `INSERT INTO users (display_name, email, password_hash, weekly_goal, unit)
       VALUES ('Demo User', 'demo@fitflextrack.app', $1, 5, 'metric') RETURNING id`,
      [hash]
    );
    userId = res.rows[0].id;
    console.log(`✓ Demo user created (id=${userId})`);
  }

  const updated = await pool.query(
    'UPDATE workouts SET user_id=$1 WHERE user_id IS NULL',
    [userId]
  );
  console.log(`✓ Linked ${updated.rowCount} orphaned workouts to demo user`);

  await pool.end();
  console.log('Done. Login: demo@fitflextrack.app / Demo1234');
}

seedDemoUser().catch((err) => { console.error(err); process.exit(1); });
