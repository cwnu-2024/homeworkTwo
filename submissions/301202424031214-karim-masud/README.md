# FitFlexTrack – Health & Exercise Logger

## App Idea

FitFlexTrack is a personal workout tracker where you can create an account, log exercise sessions, browse and search your full history, edit or delete entries, and view progress statistics with charts. The app demonstrates a complete multi-screen user flow with authentication, backed by a PostgreSQL database and a REST API.

## Technology Used

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite, React Router v6, TailwindCSS, Recharts, Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Styling | TailwindCSS (dark mode support) |

## How to Run

### Prerequisites

- Node.js 18 or higher
- PostgreSQL server running

### 1. Create the database

```sql
CREATE DATABASE fitlog;
```

### 2. Run the schema

```bash
psql -U postgres -d fitlog -f server/db/schema.sql
```

### 3. Configure environment variables

```bash
cd server
copy .env.example .env
```

Open `server/.env` and fill in your PostgreSQL credentials.

### 4. Start the backend server

```bash
cd server
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

### 5. Start the frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. For the best mobile experience, use DevTools device emulation (e.g., iPhone 14 Pro, 390 × 844).

## Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Login | `/login` | Sign in with email and password; redirects to Home on success |
| 2 | Signup | `/signup` | Create a new account; validates email format and password length |
| 3 | Home | `/` | Dashboard with summary cards (total workouts, total time, this week) and 3 recent entries |
| 4 | History | `/history` | Full list of workouts with live text search and activity-type filter chips |
| 5 | Add Workout | `/add` | Form to log a new workout; validates all fields before saving |
| 6 | Edit Workout | `/edit/:id` | Same form pre-filled with existing data; saves changes via PUT |
| 7 | Detail | `/workout/:id` | Full workout view with Edit and Delete buttons (delete confirmation bottom sheet) |
| 8 | Statistics | `/stats` | Bar chart (last 7 days), pie chart (by activity type), and 4 summary stat cards |
| 9 | Settings | `/settings` | Toggle dark/light mode and manage account preferences |

## Form Fields and Validation Rules

| Field | Input Type | Validation Rule |
|-------|-----------|----------------|
| Activity Name | text | Required; minimum 3 characters |
| Activity Type | select / dropdown | Required; one of Running, Cycling, Swimming, Gym, Yoga, Other |
| Duration | number | Required; must be between 1 and 600 minutes |
| Date | date | Required; must not be in the future |
| Intensity | radio (Low / Medium / High) | Required |
| Notes | textarea | Optional; no validation rule |

## How Data Moves Between Screens

1. **Signup / Login** authenticate the user via `POST /api/auth`; a JWT token is stored in `AuthContext` and used for all subsequent requests.
2. **Add Workout** submits a `POST /api/workouts` request; Express inserts the row into PostgreSQL and returns the new record.
3. **Home** and **History** call `GET /api/workouts` (with optional `?search=` and `?type=` query params) to fetch and display all entries.
4. **Detail** calls `GET /api/workouts/:id` using the route parameter from the URL.
5. **Edit Workout** pre-fills the form from `GET /api/workouts/:id`, then submits changes via `PUT /api/workouts/:id`.
6. **Statistics** calls `GET /api/stats` which returns aggregate totals and breakdowns used by the charts.

## Project Structure

```
301202424031214-karim-masud/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── pages/            # One file per screen (9 screens)
│   │   ├── components/       # Shared UI (BottomNav, WorkoutCard, WorkoutForm)
│   │   ├── context/          # AuthContext, ThemeContext
│   │   ├── App.jsx           # Router and route protection
│   │   └── main.jsx          # App entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                   # Express backend
│   ├── db/                   # schema.sql and DB connection
│   ├── routes/               # Express route handlers
│   ├── middleware/            # Auth middleware
│   ├── index.js              # Server entry point
│   └── package.json
├── screenshots/              # Required screenshots (home, form, summary)
├── README.md
└── AI_USAGE.md
```

## Screenshots

| File | Screen |
|------|--------|
| `screenshots/home.png` | Home dashboard |
| `screenshots/form.png` | Add Workout form |
| `screenshots/summary.png` | Detail / summary screen |

## Known Problems or Unfinished Work

None – all minimum requirements are met. Screenshots must be added to the `screenshots/` folder before final submission.
