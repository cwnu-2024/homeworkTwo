# Verdure — Habit Tracker

**Student:** Abdul Wasi Rasooli (呼延)  
**Student ID:** 301202424031143  
**Major:** Software Engineering  

A minimal, beautiful habit-tracking web app built as a mobile-first single-page application.

## App Idea

**Verdure** lets users build and track daily habits. The name comes from the word for lush green vegetation — a metaphor for small, consistent growth. Users can create habits with a category, schedule, colour tag, and personal motivation note. Each day they can check off habits and watch their streak grow.

---

## Technology

| Layer        | Choice                          |
|--------------|---------------------------------|
| Language     | HTML5, CSS3, Vanilla JavaScript |
| Fonts        | Google Fonts (Lora + DM Sans)   |
| Storage      | `localStorage` (no server)      |
| Framework    | None — zero dependencies        |

The entire app ships as a **single `index.html` file** with embedded CSS and JS.

---

## How to Run

1. Open `index.html` in any modern browser (Chrome, Safari, Firefox, Edge).  
   No build step, no server, no dependencies needed.
2. For the best experience, use browser DevTools → toggle device toolbar → select a phone preset (e.g. iPhone 14, 390 × 844).
3. Or visit it directly by opening the file: `file:///path/to/index.html`

---

## Screens

| # | Screen | Route/Trigger |
|---|--------|---------------|
| 1 | **Home (Today)** | Default screen on load |
| 2 | **Add Habit** | FAB `+` button or bottom nav |
| 3 | **Habit Detail** | Tap any habit card on Home |

---

## Requirements Checklist

### ✅ Three Screens
- Home screen with today's habits and progress summary
- Add Habit form screen
- Habit Detail screen with stats and weekly completion grid

### ✅ Navigation
- Bottom navigation bar (Home / Add)
- Floating Action Button (FAB) on Home screen
- Back button (`←`) on Add and Detail screens
- Slide-in/out transitions between screens

### ✅ Form with ≥ 4 Fields and ≥ 2 Input Types

| Field          | Type        |
|----------------|-------------|
| Habit Name     | `text`      |
| Category       | `select`    |
| Frequency      | `radio`     |
| Start Date     | `date`      |
| Reminder Time  | `time`      |
| Colour Tag     | `radio`     |
| Notes          | `textarea`  |

### ✅ Validation
- **Habit Name**: Required, minimum 3 characters
- **Category**: Required (must select an option)
- **Frequency**: Required (radio group must have a selection)
- **Start Date**: Required; must not be in the past
- **Notes**: Optional, maximum 200 characters with live character counter
- All validation messages are displayed inline beneath the relevant field
- First invalid field is scrolled into view on failed submit

### ✅ Data Flow
- Habit data is saved to `localStorage` on form submission
- Home screen reads from `localStorage` and renders all habits
- Detail screen reads the specific habit by ID and displays all saved fields
- Daily completion log is also persisted in `localStorage`

### ✅ Mobile Interface
- Viewport meta tag prevents zooming
- Maximum width of 430 px centred on desktop; full width on mobile
- All tap targets are ≥ 44 × 44 px
- Custom select styling with arrow indicator
- No horizontal scrolling at any screen size

---

## Project Structure

```
habit-tracker/
├── index.html      ← Entire application (HTML + CSS + JS)
├── README.md       ← This file
└── AI_USAGE.md     ← AI disclosure
```
