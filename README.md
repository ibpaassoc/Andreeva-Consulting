# Andreeva Consulting

Bilingual Next.js marketing site: Russian `/`, English `/en`, legal routes `/terms`, `/privacy`, `/en/terms`, and `/en/privacy`. Content sections are small feature components; shared brand controls live in `shared/`, service copy in `features/Services/content.ts`, and global design tokens in `app/globals.css` and `DESIGN.md`.

## Run

`npm install` then `npm run dev`. `npm run build` and `npx tsc --noEmit` verify production and types.

## Before launch

1. Obtain and publish company-approved offer and privacy policy in both languages, replacing the pending text in `features/LegalPage.tsx`. Only then set `PRIVACY_COPY_APPROVED=true` in the deployment environment. The site intentionally does not collect inquiries or load the third-party booking iframe before this gate is enabled.
2. Create a Calendly account on the owner's work email, connect the working calendar and Google Meet/Zoom, create one 30-minute free event, configure availability, confirmation, host notification, and invitee questions (name, email, WhatsApp phone, state, specialty, question, referral source). Verify each of the 50 state options and both language experiences in the actual event. Set `NEXT_PUBLIC_CALENDLY_URL` to its HTTPS event URL. The site embeds the configured event; it cannot create or configure the account by itself.
3. Calendly's current Free plan allows one event type and one calendar, but its 24-hour and 1-hour automated reminders require a paid plan/automation or another approved scheduling/email solution. A single event's confirmation language should be tested with both locales; do not promise separate RU/EN emails without a verified configuration. See [Calendly pricing](https://calendly.com/pricing), [Automations](https://calendly.com/help/automations-overview), and [booking notifications](https://calendly.com/help/calendly-scheduling-notifications).
4. Provide a verified mail sender, recipient, and API key for the question form (`QUESTION_FROM_EMAIL`, `QUESTION_TO_EMAIL`, `RESEND_API_KEY`). The API sends plain-text messages server-side; no keys are exposed to the browser. Add production abuse controls/rate limiting before broad public traffic.
5. Supply 5–6 real, publication-approved reviews in `features/Reviews/Reviews.tsx`; approve the founder bio and any performance/time claims. Add confirmed email and social URLs from `.env.example`. Confirm the exact exam-partner wording. No prices are shown.

The provided no-exam state list is intentionally not presented as a blanket guarantee: licensing and examination rules vary by specialty and may change. Verify with each state board before publishing categorical state claims.
