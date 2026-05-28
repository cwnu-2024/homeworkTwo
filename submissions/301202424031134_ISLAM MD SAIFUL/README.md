# Campus FixIt

Campus FixIt is a small mobile web application for submitting campus service requests, such as broken lights, classroom issues, or Wi-Fi problems. The app is designed for a phone-sized screen and demonstrates a complete flow from the home screen, to a request form, to a submitted request summary.

## Technology Used

- HTML
- CSS
- JavaScript
- Browser `localStorage` for saving submitted requests

## How to Run

Open `index.html` in a web browser. No installation or build step is required.

For review, use a mobile-sized browser window or phone emulator. The layout is responsive and works best around 390px wide.

## Completed Requirements

- At least three screens: Home, New Request, Request Summary, and History.
- Navigation between screens using visible buttons and bottom navigation.
- Form with more than four fields:
  - Full name
  - Email
  - Campus area
  - Problem category
  - Date noticed
  - Priority
  - Description
  - Follow-up checkbox
- Multiple input types: text, email, select, date, radio buttons, textarea, and checkbox.
- Validation:
  - Required fields are checked.
  - Email must use a valid email format.
  - Description must be at least 12 characters.
  - Date noticed cannot be in the future.
- Data flow:
  - Submitted form data appears on the summary screen.
  - Requests are saved in local storage and displayed on the history screen.
- Mobile interface:
  - Large tap targets, readable text, sticky bottom navigation, and responsive layout.

## Submission Note

The folder name uses placeholder student information because no student ID or English name was provided. Before submitting, rename:

`submissions/00000000-student-name/`

to:

`submissions/<student-id>-<english-name>/`
