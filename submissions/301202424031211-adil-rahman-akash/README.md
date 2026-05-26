# Campus Course Planner

## App Idea

Campus Course Planner is a small mobile web application for preparing a student course registration request. A student can start from the home screen, fill in course details, review the submitted information, and see recently saved requests. The app is intentionally small so the full user flow can be checked easily on a phone-sized screen.

## Technology Used

- HTML
- CSS
- JavaScript
- Browser localStorage for saving submitted form data

## How to Run

Open `index.html` in a web browser. No install step is required because this project uses plain HTML, CSS, and JavaScript.

## Screens

- Home: introduces the course planner and links to the form.
- Register: contains the course registration form.
- Summary: displays the submitted form data.
- Saved: lists recent requests stored in localStorage.

## Form Fields and Validation Rules

- Full name: required text field.
- Student ID: required text field; must contain 12 to 18 digits.
- Course: required dropdown selection.
- Credits: required number field; must be a whole number from 1 to 6.
- Preferred start date: required date field; cannot be in the past.
- Study mode: radio buttons for in-person or online.
- Notes: optional textarea.
- Confirmation checkbox: required before submitting.

## Data Flow

When the form is submitted successfully, JavaScript collects the form data, validates it, saves it in browser localStorage, and navigates to the Summary screen. The Summary screen reads the newest submitted request and displays the entered information. The Saved screen reads the saved list from localStorage and displays recent requests.

## Known Problems or Unfinished Work

No known unfinished requirements. The saved data is local to the browser and will not sync between devices.
