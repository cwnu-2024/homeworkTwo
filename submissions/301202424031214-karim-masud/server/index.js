require('dotenv').config();
const express = require('express');
const cors = require('cors');
const workoutsRouter = require('./routes/workouts');
const statsRouter    = require('./routes/stats');
const authRouter     = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`FitFlexTrack server running on http://localhost:${PORT}`);
});
