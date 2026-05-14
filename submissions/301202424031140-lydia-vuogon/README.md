# Habit Tracker

A mobile web application for tracking daily habits. Users can create new habits with a target frequency and a category, view all their habits on the home screen, and see full details on a dedicated detail screen.

## Technology

- React 18
- React Router v6
- Vite
- Pure CSS (no framework)

## How to Run

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173) on a mobile phone or in a browser's mobile view.

## Screens

1. **Home Screen** (`/`) — lists all habits with category and weekly target. Empty state shown when no habits exist. Floating button to add a new habit.
2. **Add Habit Screen** (`/add`) — form to create a new habit.
3. **Habit Detail Screen** (`/habit/:id`) — shows full details of a selected habit.

## Form Fields and Validation Rules

| Field | Type | Required | Validation |
|---|---|---|---|
| Habit Name | text | Yes | Min 2 characters |
| Category | select/dropdown | Yes | Must select an option |
| Times per Week | number | Yes | Must be integer between 1 and 7 |
| Goal Description | textarea | No | — |
| Start Date | date | Yes | Must be today or later |

## Data Flow

The `HabitContext` (React Context + useReducer) holds the array of habits in memory. When the user submits the form on the Add Habit Screen, a new habit is dispatched to the context. The Home Screen reads habits from the same context to render the list. The Habit Detail Screen reads a single habit by its ID from the context.

## Known Issues

- Habits are stored in memory only and will be lost on page refresh.
- No edit or delete functionality yet.

## Requirements Checklist

- [x] At least three screens
- [x] Navigation between screens
- [x] Form with at least four fields (five fields, two+ types)
- [x] Validation (required fields + specific rules)
- [x] Form data appears on another screen
- [x] Mobile-friendly interface
- [x] README documentation
