# Homework Two: Mobile Application

Build a small mobile application that demonstrates a complete user flow across different screens. You may build either a native Android application or a mobile web application, but the final result must be usable on a phone-sized screen.

## Learning Goals

- Design an application with more than one screen.
- Implement navigation between screens.
- Build at least one form that accepts user input.
- Validate input and show useful feedback.
- Store or pass form data so another screen can display or use it.
- Keep the project organized so it can be reviewed by humans and AI tools.

## Application Theme

The topic is open. Choose a small realistic application idea, for example:

- personal habit tracker
- course registration helper
- expense recorder
- event sign-up app
- food ordering prototype
- campus service request app
- simple travel planner
- health or exercise logger

Do not copy a full existing commercial application. Keep the scope small enough to finish well.

## Technical Options

You may choose one of these options:

1. **Native Android**
   - Kotlin or Java is allowed.
   - Android Studio project structure is recommended.
   - Jetpack Compose or XML layouts are both acceptable.

2. **Mobile Web**
   - HTML, CSS, and JavaScript are allowed.
   - A framework such as React, Vue, Svelte, or plain JavaScript is acceptable.
   - The app must be responsive and comfortable on a mobile screen.

## Minimum Functional Requirements

Your application must include all of the following:

1. **At least three screens**
   - Example: Home, Form/Create, Detail/Summary.
   - Screens may be Android activities/fragments/Compose screens or mobile web routes/views.

2. **Navigation**
   - Users must be able to move between screens using visible UI controls.
   - Back navigation should work naturally where possible.

3. **A form**
   - Include at least four input fields.
   - Use at least two different input types, such as text, number, date, select/dropdown, checkbox, radio, switch, or textarea.

4. **Validation**
   - Required fields must be checked.
   - At least one field must have a specific rule, such as minimum length, numeric range, date rule, email format, or phone format.
   - Validation messages must be visible to the user.

5. **Data flow**
   - Data entered in the form must appear on another screen.
   - You may use state, route parameters, local storage, a local database, or another reasonable local method.

6. **Mobile interface**
   - The app must be readable and usable on a phone-sized screen.
   - Buttons, form controls, and navigation elements should be easy to tap.

7. **README documentation**
   - Your submission folder must include a short README explaining the app idea, technology used, how to run it, and which requirements are completed.

## AI Use Policy

AI tools are allowed. You may use AI to brainstorm, generate code, debug, improve UI, or write documentation. You are still responsible for understanding and explaining your own submission.

Each submission must include an `AI_USAGE.md` file with:

- which AI tool or model you used
- what you asked it to help with
- which parts of the final project were AI-assisted
- what you changed or verified yourself

Submissions without honest AI disclosure may lose marks.

## Submission Method

Submit your work by pull request in this repository.

1. Create a branch named:

   ```text
   submit/<student-id>
   ```

2. Add your project under:

   ```text
   submissions/<student-id>-<english-name>/
   ```

3. Include all required files described in [SUBMISSION_STANDARD.md](SUBMISSION_STANDARD.md).

4. Open a pull request to the `main` branch.

5. The pull request title must use this format:

   ```text
   <student-id> <english-name> Homework Two
   ```

## Deadline

The deadline will be announced by the teacher in class.

Late submissions may lose marks unless permission is given before the deadline.

## Grading

See [REVIEW_RUBRIC.md](REVIEW_RUBRIC.md) for the grading standard.

