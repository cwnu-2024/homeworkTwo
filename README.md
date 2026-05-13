# HabitFlow – Daily Habit Tracker

## App Idea

HabitFlow is a mobile-friendly habit tracking application that lets users create daily habits, set goals, and track their progress with streaks. Users can add a habit with a custom icon, colour, and schedule, then mark it as done each day to build a streak. Tapping a habit opens a detail screen showing all stored information from the form.

## Technology Used

- Plain HTML, CSS, and JavaScript (no frameworks, no build tools)
- `localStorage` for persisting habits across page refreshes
- Responsive CSS custom properties and flexbox/grid layout

## How to Run

Open `index.html` in any modern web browser. No installation or build step is required.

```
open index.html
```

For a phone-like view in desktop Chrome/Firefox, open DevTools → toggle device toolbar → select a phone preset (e.g. iPhone 14).

## Screens

| Screen | Description |
|---|---|
| **Home** | Shows total habits, habits done today, best streak, and a card list of all habits with quick-check buttons |
| **New Habit (Form)** | Form to create a new habit |
| **Habit Detail** | Full detail view of a selected habit showing all form data, mark-done toggle, and delete button |

## Form Fields and Validation Rules

| Field | Type | Validation |
|---|---|---|
| Habit Name | Text | Required; minimum 3 characters |
| Category | Select / Dropdown | Required; must choose one of 7 categories |
| Daily Goal (minutes) | Number | Required; must be between 1 and 1440 |
| Start Date | Date | Required; must not be in the past |
| Frequency | Segmented button tabs | Optional; defaults to Daily |
| Reminder | Checkbox / Toggle | Optional |
| Icon | Button grid (emoji) | Optional; defaults to 🏃 |
| Color | Color picker buttons | Optional; defaults to purple |
| Notes | Textarea | Optional; no validation |

## How Data Moves Between Screens

When the form is submitted, a habit object is pushed into an in-memory array and also saved to `localStorage`. The Home screen reads from this array to render habit cards. When a card is tapped, the habit's `id` is used to look up the full object and populate the Detail screen with every field that was entered in the form (name, category, goal, date, frequency, reminder, streak, notes). No routing library is used; screens are toggled with `display: flex / none` and a shared `goTo()` helper.

## Known Issues / Unfinished Work

- Reminder toggle is UI-only; actual push notifications are not implemented (browser Notification API would require HTTPS and user permission).
- The streak counter increments each time a habit is marked done but does not reset overnight automatically; a real implementation would compare the last-done date with today's date.
- No edit screen — users must delete and re-create a habit to change it.
