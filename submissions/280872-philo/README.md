# Health Logger

A mobile web app to log daily exercise activities. Users can record their workouts including exercise type, duration, intensity, and notes, then view their logs on the home dashboard.

## Technology

- HTML, CSS, Vanilla JavaScript
- No frameworks or build tools required
- Local Storage for data persistence
- Mobile-first responsive design

## How to Run

Open `index.html` in any modern mobile browser or desktop browser with mobile dev tools enabled.

No server or installation needed. Just open the file.

## Screens

1. **Home** — Shows today's total exercise minutes, entry count, and a list of today's logs. Tap any log to see details. "Add New Log" button navigates to the form.
2. **Form** — A health log entry form with date, exercise type, duration, intensity, and notes fields. Validates input before saving.
3. **Detail/Summary** — Shows the full details of a submitted log entry including date, exercise type, duration, intensity, and notes.

## Form Fields and Validation Rules

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Date | date | Yes | Must not be empty |
| Exercise Type | select (dropdown) | Yes | Must select an option |
| Duration | number | Yes | Must be between 1 and 480 minutes |
| Intensity | radio (Low/Medium/High) | Yes | Must select one |
| Notes | textarea | No | — |

## Data Flow

When the user submits the form, data is validated client-side. If valid, the log entry is saved to Local Storage with a unique timestamp ID. The user is then navigated to the Detail screen showing the saved data. The Home screen reads from Local Storage to display today's aggregated stats and log list.

## Known Problems

None.
