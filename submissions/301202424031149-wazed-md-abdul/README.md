# Habit Tracker

A mobile web application for tracking daily habits. Users can create habits with goals, set categories and difficulty levels, and view their habit details on a summary screen.

## App Idea

Habit Tracker helps users build better habits by letting them define daily goals, choose categories (health, learning, productivity, social, or other), set difficulty levels, and track their progress. The app provides a simple three-screen flow: home list, create form, and detail view.

## Technology

- React 19
- React Router 7
- Vite 8
- CSS (no framework)
- Local Storage for data persistence

## How to Run

```bash
cd submissions/301202424031149-wazed-md-abdul
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## Screens

1. **Home Screen** (`/`) - Lists all created habits with name, category, and target. Shows an empty state when no habits exist. Includes a button to create new habits.
2. **Create Habit Screen** (`/create`) - A form with input fields to create a new habit. Validates all fields before saving.
3. **Habit Detail Screen** (`/habit/:id`) - Displays all information about a saved habit including name, category, target, difficulty, start date, and description.

## Form Fields and Validation

| Field | Type | Validation |
|-------|------|-----------|
| Habit Name | text | Required, minimum 3 characters |
| Category | select | Required |
| Daily Target | number | Required, must be positive (1-1000) |
| Unit | select | Optional, default "minutes" |
| Difficulty | radio (3 options) | Optional, default "medium" |
| Start Date | date | Required |
| Description | textarea | Required, minimum 10 characters |

## Data Flow

When the user submits the form on the Create Habit screen, the data is saved to the browser's Local Storage. The user is then redirected to the Habit Detail screen, which reads the data from Local Storage by the habit's unique ID and displays it. The Home screen also reads from Local Storage to list all habits.

## Known Problems

None.