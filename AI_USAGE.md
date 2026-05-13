# AI Usage

## Tools Used

- Tool/model name: Claude (claude.ai, Anthropic)

## How AI Helped

- Generated the initial HTML/CSS/JavaScript structure for the single-file mobile web application
- Designed the colour palette, card layout, emoji picker, colour picker, and segmented frequency tab UI
- Wrote the validation logic for all four required fields (name length, category selection, numeric range, date not-in-past)
- Wrote the `localStorage` persistence layer and the screen-switching helper
- Drafted the README.md and this AI_USAGE.md file

## What I Verified or Changed Myself

- Confirmed that all three screens are reachable via visible UI controls and back navigation works
- Checked that validation error messages appear and disappear correctly for each field
- Verified that data entered in the form appears correctly on the Detail screen
- Checked the layout on a phone-sized viewport in browser DevTools
- Confirmed `localStorage` persists habits after a page refresh

## Code I Do Not Fully Understand

- The CSS `box-shadow` and `backdrop-filter` tricks used for the floating action button shadow
- The exact browser rendering behaviour of `position: sticky` on the nav bar across different mobile browsers
