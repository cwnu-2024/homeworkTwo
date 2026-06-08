# Campus Fix

Campus Fix is a small mobile web application for submitting simple campus service requests. A student can start from the home screen, fill in a request form, and review the submitted information on a summary screen.

## Technology Used

- HTML
- CSS
- JavaScript
- Browser localStorage

## How to Run

Open `index.html` in a browser, or run a local server from this folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Screens

- Home: shows the app purpose and latest saved request.
- New Request: form for entering a campus service request.
- Request Summary: displays the data submitted from the form.

## Form Fields and Validation

- Student name: required, minimum 3 characters.
- Phone number: required, must be 8 to 15 valid phone characters.
- Location: required.
- Issue type: required select field.
- Priority: radio buttons with Low, Normal, and Urgent options.
- Needed by: required date, cannot be in the past.
- Description: required, minimum 12 characters.
- Contact permission: required checkbox.

## Data Flow

When the form is submitted, JavaScript validates the fields. If the data is valid, the request is saved in `localStorage` and the app navigates to the summary screen. The home screen also reads the saved request from `localStorage` to show the latest request.

## Completed Requirements

- At least three screens.
- Visible navigation controls and browser back support.
- Form with more than four fields and multiple input types.
- Required-field validation and specific validation rules.
- Submitted data appears on another screen.
- Mobile-sized responsive interface.
- README, AI usage disclosure, and screenshots folder included.

## Known Problems or Unfinished Work

No known unfinished work.
