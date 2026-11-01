# CineIT Sprint 1 Test Plan and Acceptance Criteria

Scope: Sprint Week 1 core deliverables — Login page (Sign In & Create Account), session handling, and theme toggle 
Sources: Team brief, HOPE ERP Planned Tasks spreadsheet, log-in.html, and manual testing.

## Approach
- Manual testing in the browser, one criterion at a time.
- Test accounts: one regular user and one admin 
- Bugs are reported as GitHub Issues with the bug label and steps to reproduce.
- Automated smoke test of login and dashboard comes later.

## 1. Sign In
- Empty email or password shows a "please fill out this field" message.
- An email without a valid format (no @) is rejected.
- A wrong password or an account that does not exist shows "Invalid login credentials" and does not sign the user in. 
- A correct email and password signs the user in and opens the home page, which shows "You're signed in", a welcome message with the user's name, and a Sign Out button.
- After signing out, pressing the browser Back button goes to the sign-in page and does not show the signed-in view.
- A user who has not confirmed their email cannot sign in

## 2. Create Account
- Full name must be 2 to 100 characters.
- Email must be a valid format, up to 150 characters.
- Password must be 12 to 128 characters; shorter passwords are rejected.
- The Terms and Privacy checkbox must be ticked before the form submits.
- A valid form shows the green message to check email and confirm the address.
- Registering again with an email that already exists shows a bug. Duplicate registration shows false success message.

## 3. Page and Theme
- The Sign In and Create Account tabs show the correct form and hide the other.
- The Light Mode / Dark Mode button switches the theme and updates its label.
- Text stays readable during and after a theme switch.
- The theme is remembered after a page refresh 
- The layout fits at phone width with no sideways scrolling.


## 4. Security
- Passwords are never stored or shown as plain text.
- No database secret keys appear in the code or the repository 
- Script text such as <script>alert(1)</script> in the name field is shown as plain text and does not run.
- Typing SQL such as ' OR '1'='1 in a field does not sign anyone in.

