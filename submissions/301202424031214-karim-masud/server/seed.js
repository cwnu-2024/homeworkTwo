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

const namesByType = {
  Running: ['Morning Run', 'Evening Jog', 'Park Run', '5K Training', '10K Run', 'Trail Run', 'Speed Intervals', 'Recovery Jog', 'Long Slow Run', 'Tempo Run', 'Fartlek Run', 'Hill Repeats'],
  Cycling: ['Road Ride', 'Mountain Bike', 'Indoor Cycling', 'Commute Ride', 'Hill Climb', 'Casual Bike Ride', 'Interval Ride', 'Long Distance Ride', 'Sprint Intervals', 'Recovery Ride'],
  Swimming: ['Lap Swimming', 'Open Water Swim', 'Pool Sprint', 'Endurance Swim', 'Backstroke Practice', 'Freestyle Drill', 'Butterfly Drill', 'Mixed Strokes'],
  Gym: ['Upper Body Workout', 'Leg Day', 'Full Body Strength', 'Core Training', 'Push Day', 'Pull Day', 'HIIT Session', 'Deadlift Training', 'Bench Press Session', 'Squat Day', 'Shoulder Press', 'Cable Rows'],
  Yoga: ['Morning Yoga', 'Vinyasa Flow', 'Yin Yoga', 'Power Yoga', 'Restorative Yoga', 'Meditation & Stretch', 'Hot Yoga', 'Ashtanga Flow'],
  Other: ['HIIT Workout', 'Jump Rope', 'Pilates', 'CrossFit', 'Rowing Machine', 'Rock Climbing', 'Kickboxing', 'Dance Fitness', 'Deep Stretch', 'Foam Rolling'],
};

const notes = [
  'Felt great today!',
  'A bit tired but pushed through.',
  'New personal best!',
  'Easy recovery session.',
  'High humidity made it tough.',
  'Really enjoyed this one.',
  'Focused on form throughout.',
  null, null, null,
  'Need to improve endurance.',
  'Great session with a friend.',
  'Morning session before work.',
  'Evening workout, felt energized.',
  'Challenging but very rewarding.',
  'Legs were heavy today.',
  'Felt strong and motivated.',
  null,
  'Listened to a great podcast.',
  'Weather was perfect.',
];

const activityTypes = Object.keys(namesByType);
const intensities = ['Low', 'Medium', 'High'];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function localDateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function seed() {
  console.log('Clearing existing data…');
  await pool.query('DELETE FROM workouts');

  const entries = [];

  // Guarantee at least 2 entries per day for the last 7 days (for charts)
  for (let i = 0; i <= 6; i++) {
    const count = randomBetween(2, 3);
    for (let j = 0; j < count; j++) {
      const type = randomItem(activityTypes);
      entries.push({
        name: randomItem(namesByType[type]),
        type,
        duration: randomBetween(20, 90),
        date: localDateStr(i),
        intensity: randomItem(intensities),
        notes: randomItem(notes),
      });
    }
  }

  // Fill remaining entries across the last 8–90 days
  while (entries.length < 120) {
    const type = randomItem(activityTypes);
    entries.push({
      name: randomItem(namesByType[type]),
      type,
      duration: randomBetween(15, 120),
      date: localDateStr(randomBetween(8, 90)),
      intensity: randomItem(intensities),
      notes: randomItem(notes),
    });
  }

  console.log(`Inserting ${entries.length} entries…`);
  for (const e of entries) {
    await pool.query(
      `INSERT INTO workouts (activity_name, activity_type, duration_minutes, workout_date, intensity, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [e.name, e.type, e.duration, e.date, e.intensity, e.notes]
    );
  }

  console.log(`✓ Seeded ${entries.length} workouts successfully.`);
  pool.end();
}

seed().catch((err) => {
  console.error('Seed error:', err.message);
  pool.end();
  process.exit(1);
});
