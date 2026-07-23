# The Food Plug — Cleaned & Supabase-ready

This build reorganizes the original project and fixes the broken asset/CSS/JS paths.

## What is included
- Responsive homepage, shop, cart, checkout, orders, profile, login, signup and contact pages.
- Organized `css/`, `js/`, and `assets/` folders.
- Product search, category filtering, sorting, quantity controls, cart, wishlist and order flow.
- Supabase Auth + profile/order integration using the supplied project URL and publishable key.
- Local fallback for cart/orders when Supabase tables are not yet configured.
- `supabase/schema.sql` for the database tables and RLS policies.
- Formspree is intentionally left as a placeholder in `js/checkout.js` for you to add your endpoint.

## Supabase setup
1. Open the Supabase SQL Editor for your project.
2. Run `supabase/schema.sql`.
3. In Supabase Auth, configure your allowed site URL(s) for the environment where you run the site.
4. Open `js/checkout.js` and set `FORMSPREE_ENDPOINT` to your Formspree endpoint.
5. Update the WhatsApp number in `js/checkout.js`.

## Running locally
Use a local static server (VS Code Live Server, `python -m http.server`, etc.). Do not open the HTML files directly with `file://` because module/CDN and browser storage behavior can differ.

## Important
The Supabase publishable key is intended for frontend use. Never add a Supabase `service_role` key to this project.

## Latest authentication and form fixes

- The header now reacts to the Supabase session on every page. When signed out it shows **Login**; when signed in it hides **Login** and shows **Account** and **Logout**.
- Signup now requests a Supabase confirmation email and sends the user to `confirm.html` after clicking the email link.
- `confirm-email.html` lets users resend a confirmation email.
- The included `supabase/schema.sql` creates a profile automatically from signup metadata.
- Formspree is configured for the contact form using the supplied endpoint.

### Supabase email confirmation setup

In Supabase Dashboard → Authentication → URL Configuration, add the URL for your actual website to **Site URL** and add the confirmation page to **Redirect URLs**. For local development, if your server runs on port 5500, add:

`http://localhost:5500/confirm.html`

If you use another port, replace `5500` with that port. For a deployed site, add:

`https://YOUR-DOMAIN/confirm.html`

Also make sure **Email provider** is enabled and **Confirm email** is enabled under Authentication settings. If emails still do not arrive, check the Supabase Auth email logs and spam folder; email delivery depends on the configured Supabase SMTP/email provider and cannot be guaranteed by frontend code alone.

### Formspree

The contact form is connected to the provided Formspree endpoint. You can change it later in `js/config.js` if needed.
