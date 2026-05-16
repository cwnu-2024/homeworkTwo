# Expense Tracker App

## App Name
Expense Tracker

## App Idea
This is a simple mobile-friendly expense tracking application. It allows users to add daily expenses with details such as title, amount, date, category, and optional notes. The data is stored locally and displayed on a summary screen. The app helps users understand and manage their spending in a simple and visual way.

## Technology Used
HTML, CSS, JavaScript (LocalStorage used for data storage)

## How to Run the App
1. Download or clone the project folder.
2. Open the folder in VS Code.
3. Open `index.html` in any web browser.
4. The application will run without any additional setup.

## Screens
- Home Screen (Landing page with navigation buttons)
- Add Expense Screen (Form to input expense data)
- Summary Screen (Displays saved expenses and total data)

## Form Fields and Validation Rules
- Title (required, minimum 3 characters)
- Amount (required, must be greater than 0)
- Date (required field)
- Category (required dropdown selection)
- Notes (optional field)

## Data Flow Between Screens
The data entered in the form is stored using localStorage in the browser. This data is then retrieved on the summary screen and displayed dynamically. Users can also delete entries, and updates reflect immediately.

## Known Issues / Limitations
- Data is stored only in the browser (localStorage), so it will reset if cache is cleared.
- No backend database is used.
