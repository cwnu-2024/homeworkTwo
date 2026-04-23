# Submission Standard

This standard keeps every homework submission easy to run and easy to review.

## Required Folder Name

Each student must submit in one folder:

```text
submissions/<student-id>-<english-name>/
```

Example:

```text
submissions/2024123456-alice-wang/
```

Use lowercase letters for the English name. Use hyphens instead of spaces.

## Required Files

Each submission folder must include:

```text
submissions/<student-id>-<english-name>/
  README.md
  AI_USAGE.md
  screenshots/
  source files for the app
```

## Student README Requirements

Your `README.md` must include:

- app name
- app idea in 2-4 sentences
- technology used
- how to run the app
- list of screens
- list of form fields and validation rules
- short explanation of how data moves between screens
- known problems or unfinished work, if any

## AI_USAGE.md Requirements

Use this format:

```markdown
# AI Usage

## Tools Used

- Tool/model name:

## How AI Helped

- 

## What I Verified or Changed Myself

- 

## Code I Do Not Fully Understand

- 
```

If you did not use AI, write:

```markdown
# AI Usage

I did not use AI tools for this homework.
```

## Screenshot Requirements

Add at least three screenshots in:

```text
screenshots/
```

Required screenshots:

- one home or start screen
- one form screen
- one detail, summary, or result screen showing submitted data

Use clear file names, for example:

```text
screenshots/home.png
screenshots/form.png
screenshots/summary.png
```

## Android Project Rules

For Android submissions:

- Include source code and Gradle configuration needed to open the project.
- Do not submit build outputs such as `build/`, `.gradle/`, APK files, or IDE caches.
- The project should open in Android Studio.
- The README must mention the tested Android version or emulator.

## Mobile Web Project Rules

For mobile web submissions:

- Include all source files needed to run the app.
- If using npm, include `package.json` and the lock file if one exists.
- Do not submit `node_modules/`, `dist/`, or build output folders.
- The README must include install and run commands.

## Pull Request Rules

- Submit only your own folder under `submissions/`.
- Do not edit another student's folder.
- Do not edit assignment files unless the teacher asks you to.
- Make one pull request per student.
- Keep your pull request open until review is complete.

## Review Readiness Checklist

Before opening the pull request, check:

- The app has at least three screens.
- Navigation works.
- The form has at least four fields.
- Validation messages are visible.
- Submitted data appears on another screen.
- The app fits a mobile screen.
- `README.md` is complete.
- `AI_USAGE.md` is complete.
- Screenshots are included.
- Build/cache files are not committed.

