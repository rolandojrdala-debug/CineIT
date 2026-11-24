# CineIT Authentication UI — Version 2

A distinct alternative to the first mockup. It keeps the black, charcoal and bright-green palette, but uses a centered authentication card, compact brand header, editorial welcome panel, and film-reel inspired decorative elements instead of the original split-screen booking panel.

## Files
- `index.html` — semantic page structure and login/register forms
- `styles.css` — responsive visual system
- `app.js` — form switching, password visibility, validation and API requests

## Run
Open `index.html` for a frontend preview. For real authentication, serve it through your application and implement the endpoints below.

## API contract
- `POST /api/auth/register` accepts `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login` accepts `{ "email": "...", "password": "..." }`

Return JSON such as `{ "message": "Account created" }`. Use non-2xx HTTP responses for errors with `{ "message": "Explanation" }`.

Set `API_BASE_URL` at the top of `app.js` if your backend is on a separate origin. Configure CORS appropriately.

## Security
- Do not connect browser JavaScript directly to SQL or expose database credentials.
- Hash passwords on the server with Argon2id or bcrypt. Never store plaintext passwords.
- Validate all fields on the server and use parameterized SQL queries.
- Use HTTPS, rate limiting and secure `HttpOnly`, `Secure`, `SameSite` session cookies in production.
- Replace placeholder links with real routes and policy pages.

## Suggested PR
**Title:** Create alternate CineIT authentication interface

**Summary:** Add a responsive login and registration interface using CineIT's black and green visual palette, with client-side validation, password visibility controls, and documented backend integration points.

## PHP Backend Integration

CineIT uses PHP for server-side checkout validation,
price calculation, and demo ticket generation.

### Requirements

- PHP 8.0 or newer
- PHP mbstring extension
- VS Code with Live Server

### Run the PHP Backend

From the project root:

```powershell
php -S localhost:8000 -t ./php-backend
```

Verify the backend at:

http://localhost:8000/status.php

### Run the Frontend

Open the root index.html using VS Code Live Server.

Frontend: http://127.0.0.1:5500
PHP API: http://localhost:8000

Both servers must remain running during checkout.

### PHP Integration Files

- php-backend/status.php
- php-backend/catalog.php
- php-backend/checkout.php
- booking/checkout-api.js
- booking/payment.html
- booking/ticket.html

### Implemented Features

- Server-side booking validation
- Server-side ticket and snack price calculation
- Protection against manipulated checkout prices
- Past screening date validation
- Occupied demo seat validation
- Snack quantity validation
- Server-generated booking references
- Printable demo tickets

### Authentication

Existing Supabase authentication remains unchanged.
PHP handles checkout, while JavaScript handles
frontend interactions.

### Limitations

Checkout is for demonstration purposes only.
Actual payments, permanent seat reservations,
and production PHP hosting
are not implemented.

### Ticket Delivery with EmailJS

Customers can choose how to receive their demo cinema ticket:

- Print / Save PDF Ticket
- Email Ticket
- Book Another Movie

EmailJS sends an HTML email containing the booking reference,
movie, cinema, screening schedule, selected seats, snacks,
payment method, and PHP-calculated total.

Email delivery occurs only when the customer selects
the Email Ticket button and confirms the recipient.

The email integration is implemented in:

- booking/ticket-email.js
- booking/ticket.html

Email delivery has been successfully tested using Gmail.

The system does not process actual payments or reserve
real cinema seats. Tickets are for demonstration only.

Before public deployment, configure EmailJS allowed origins
and stronger anti-spam protection.
