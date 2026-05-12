# SpendWise - Expense Recorder

**App Idea:** 
SpendWise is a minimalist mobile web app designed to help students track daily spending. Users can log expenses with categories and dates, then view a summary of their total spending to stay on budget.

**Technology Used:** 
HTML5, CSS3 (Responsive Design), Vanilla JavaScript, LocalStorage API.

**How to Run:**
1. Open `index.html` in any mobile browser or a desktop browser with "Inspect -> Mobile View" enabled.
2. No installation or `npm` required.

**List of Screens:**
- Home Screen: Displays total balance and "Add Expense" button.
- Form Screen: Input fields to record a new transaction.
- Summary Screen: Shows a list of all submitted expenses and total cost.

**Form Fields & Validation:**
- Item Name: Required (Text).
- Amount: Required, must be a number > 0 (Number).
- Category: Required (Dropdown).
- Date: Required, cannot be a future date (Date).

**Data Flow:**
Data is collected via the Form Screen, validated, and saved into the browser's `localStorage`. The Summary Screen retrieves this array of objects to render the list.