# CampusFix Mobile

CampusFix Mobile is a small campus service request app for reporting maintenance problems such as broken lights, water issues, network problems, furniture damage, or cleaning needs. A student can start a request, enter the details, submit the form, and review the saved summary on another screen.

## Technology Used

- Mobile web application
- HTML, CSS, and plain JavaScript
- Browser `localStorage` for saving the latest submitted request

## How to Run

Open `index.html` in a web browser. No package installation is required.

For best review, open the page with a phone-sized viewport such as 390 x 844 pixels.

## Screens

- Home screen: introduces the app and links to the request form or last summary.
- New Request screen: contains the service request form.
- Request Summary screen: displays the submitted form data and allows editing or clearing the saved request.

## Form Fields and Validation Rules

- Your name: required, at least 2 characters.
- Phone number: required, must match an 11-digit mainland China phone number pattern.
- Problem category: required dropdown selection.
- Location: required, at least 5 characters.
- Preferred service date: required, cannot be in the past.
- Urgency: radio buttons for Normal or Urgent.
- Description: required, at least 10 characters.
- Contact permission: checkbox must be selected.

## Data Flow

When the user submits a valid request, JavaScript collects the form values and saves them as JSON in browser `localStorage`. The summary screen reads that saved object and displays the latest request. The edit button reloads the saved data into the form.

## Completed Requirements

- At least three screens.
- Visible navigation controls between screens.
- A form with more than four fields.
- Multiple input types: text, telephone, select, date, radio, textarea, and checkbox.
- Required field validation and specific validation rules.
- Visible validation messages.
- Submitted data appears on the summary screen.
- Mobile-friendly layout.
- README, AI usage file, and screenshots included.

## Known Problems or Unfinished Work

- This prototype saves only the latest request.
- There is no server or real campus maintenance backend.
