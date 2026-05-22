# SpendWise Expense Recorder

SpendWise is a small mobile web app for recording daily expenses. It lets a user add an expense, checks the form for mistakes, saves the record in the browser, and shows the saved information on a summary screen.

## Technology Used

- HTML for the app structure
- CSS for the mobile layout and visual design
- JavaScript for navigation, validation, saving data, and updating the screens
- Browser local storage, which saves small amounts of data inside the browser

## How to Run

1. Open the folder `submissions/0000000000-your-name/`.
2. Double-click `index.html`.
3. The app will open in your web browser.

No installation is required. A modern browser such as Chrome, Edge, Firefox, or Safari is enough.

## Screens

- Home screen: shows the total spending amount, number of entries, and recent expenses.
- Add Expense screen: contains the form for entering a new expense.
- Expense Summary screen: shows the last saved expense and all saved expenses.

## Form Fields and Validation Rules

- Expense title: required and must be at least 3 characters.
- Amount: required and must be between `$0.01` and `$10,000`.
- Date: required and cannot be in the future.
- Category: required and selected from a dropdown list.
- Note: optional, with a maximum of 160 characters.
- Reimbursable: optional checkbox.

## How Data Moves Between Screens

When the user saves the form, JavaScript creates an expense record and stores it in browser local storage. The app then opens the Summary screen and displays the same saved data there. The Home screen also updates the total amount and recent expense list from the saved records.

## Requirements Completed

- At least three screens
- Navigation between screens
- A form with more than four fields
- Multiple input types: text, number, date, dropdown, textarea, and checkbox
- Visible validation messages
- Form data appears on another screen
- Mobile-friendly interface
- README file
- AI usage file
- Screenshots folder

## Known Problems or Unfinished Work

The data is saved only in the browser on the current device. It does not sync to another phone or computer.
