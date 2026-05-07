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
