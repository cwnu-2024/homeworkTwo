# Expense Recorder

A simple mobile web app for recording and tracking daily expenses. Users can add expenses with title, amount, category, and date, then view them in a list or detail screen.

## Technology

- HTML5, CSS3, Vanilla JavaScript
- localStorage for data persistence
- No frameworks or external libraries

## How to Run

Open `index.html` in any modern mobile browser or desktop browser with mobile view (Chrome DevTools responsive mode, 375px-480px width).

No build tools or npm required.

## Screens

1. **Home** - Dashboard showing total expenses and entry count, with navigation to add or view expenses
2. **Add Expense** - Form with 4 required input fields and validation
3. **Expense List** - Scrollable list of all saved expenses
4. **Expense Detail** - Full details of a selected expense with delete option

## Form Fields & Validation

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Title | text | Yes | Minimum 2 characters |
| Amount | number | Yes | Must be greater than $0 |
| Category | select/dropdown | Yes | Must select a category |
| Date | date | Yes | Cannot be in the future |
| Description | textarea | No | - |

## Data Flow

The form data is saved to the browser's localStorage as a JSON array. The home screen reads localStorage to calculate totals. The list screen reads all entries and renders them. The detail screen finds a single entry by ID. All screens read from the same localStorage source.

## Known Problems

None.
