require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const sql = `
  CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    activity_name VARCHAR(100) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    workout_date DATE NOT NULL,
    intensity VARCHAR(10) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

pool.query(sql)
  .then(() => {
    console.log('workouts table created successfully.');
    pool.end();
  })
  .catch((err) => {
    console.error('Error:', err.message);
    pool.end();
    process.exit(1);
  });
