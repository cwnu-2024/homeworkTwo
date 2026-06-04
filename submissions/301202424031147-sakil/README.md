# CampusFix Mobile

CampusFix Mobile is a small mobile web application for submitting campus service requests. Students can report maintenance, technology, cleaning, or safety issues from a phone-sized screen. The app saves submitted requests locally and shows the saved details on a summary screen.

## Student Information

- Student ID: 301202424031147
- English name: SAKIL

## Technology Used

- HTML
- CSS
- JavaScript
- Browser localStorage for saved request data

## How to Run

Open `index.html` in a web browser.

No package installation or build step is required.

## Screens

- Home: introduces the app and links to create or view requests.
- New Request: contains the service request form.
- Request Summary: displays saved request data from the form.

## Form Fields And Validation Rules

- Your name: required.
- Email: required and must use a valid email format.
- Category: required dropdown selection.
- Campus location: required.
- Priority: radio selection with Low, Medium, and High options.
- Needed by: required date and cannot be in the past.
- Problem description: required and must be at least 12 characters.
- Contact permission: optional checkbox.

## Data Flow

When the form is submitted successfully, JavaScript stores the request object in browser localStorage. The app then navigates to the Request Summary screen, reads the saved localStorage data, and displays the submitted request details.

## Known Problems Or Unfinished Work

No known unfinished requirements.

## Submission Details

Project folder:

```text
submissions/301202424031147-sakil/
```

Submission branch:

```text
submit/301202424031147
```

Pull request title:

```text
301202424031147 SAKIL Homework Two
```
