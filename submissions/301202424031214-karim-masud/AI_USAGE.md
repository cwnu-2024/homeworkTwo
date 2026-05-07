# AI Usage

## Tools Used

- Tool/model name: Windsurf Cascade (Claude Sonnet 3.7)

## How AI Helped

- Designed the overall full-stack architecture (React + Express + PostgreSQL)
- Generated all source code for the six frontend pages and three shared components
- Set up Vite, TailwindCSS, and PostCSS configuration
- Designed the PostgreSQL schema and all Express API routes (CRUD + stats)
- Built the shared `WorkoutForm` component with client-side validation logic
- Created Recharts bar and pie chart integration in the Statistics page
- Generated this README and AI_USAGE documentation

## What I Verified or Changed Myself

- Reviewed all generated code to understand the component structure and data flow
- Confirmed the six screens match the assignment requirements
- Verified the form has at least four fields with at least two different input types
- Checked that validation messages are visible for every field
- Confirmed data entered in the form appears on the History, Detail, and Statistics screens
- Reviewed the database schema to ensure all form fields are stored correctly
- Tested the app in a browser at mobile viewport width

## Code I Do Not Fully Understand

- Recharts `ResponsiveContainer` sizing behavior and PieChart layout internals
- PostgreSQL `ILIKE` and `INTERVAL` query syntax details
- Vite proxy configuration (`server.proxy`) and how it forwards `/api` requests
