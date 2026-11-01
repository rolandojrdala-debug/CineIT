CineIT Supabase Authentication Update

Folder structure:
- index.html, index.css, index.js
- supabase-config.js
- log-in/log-in.html, log-in/log-in.css, log-in/log-in.js

The Supabase browser client uses the project's publishable key. Do not add a service_role/secret key.

Before testing:
1. Ensure your Supabase profiles table and on_auth_user_created trigger are installed (the SQL you supplied earlier).
2. In Supabase Authentication URL Configuration, add your deployed site URL to Site URL / Redirect URLs.
3. If testing locally, serve this folder with a local web server (not file://), and add the local origin/redirect URL in Supabase Auth URL Configuration.
4. Signup may require email confirmation depending on your Supabase Auth settings. If enabled, check the email before signing in.
5. The registration form requires a 12-character password, matching your existing HTML validation.

The project uses the Supabase JS v2 CDN and plain HTML/CSS/JS; no Next.js installation is required.
