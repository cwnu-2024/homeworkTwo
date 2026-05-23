# Pocket Spend

Pocket Spend is a small mobile web application for recording one recent expense. A user can start on the home screen, enter expense details in a form, and view the saved data on a separate summary screen. The scope is intentionally small so the complete flow is easy to test on a phone-sized screen.

## Technology Used

- HTML
- CSS
- JavaScript
- Browser localStorage

## How to Run

Open `index.html` in a web browser. For the best review experience, use a phone screen or browser mobile device mode around 390px wide.

## Screens

- Home screen: shows the latest saved expense and navigation buttons.
- New Expense screen: contains the expense form and validation messages.
- Expense Summary screen: displays the submitted expense data.

## Form Fields and Validation Rules

- Expense title: required, minimum 3 characters.
- Category: required dropdown selection.
- Amount in USD: required number from 0.01 to 5000.
- Expense date: required date, cannot be in the future.
- Payment method: required radio selection.
- Reimbursable: optional checkbox.
- Notes: optional text area.

## Data Flow

When the user submits a valid form, JavaScript saves the expense object in `localStorage`. The summary screen reads that stored object and displays the title, category, amount, date, payment method, reimbursable status, and notes. The home screen also reads the same stored data to show the latest expense.

## Completed Requirements

- At least three screens.
- Visible navigation between screens.
- Form with more than four input fields.
- Multiple input types: text, select, number, date, radio, checkbox, and textarea.
- Required-field validation and specific validation rules.
- Submitted data appears on another screen.
- Mobile-friendly interface.
- README, AI_USAGE, and screenshots folder included.

## Known Problems or Unfinished Work

- The app stores only one latest expense instead of a full expense history.
