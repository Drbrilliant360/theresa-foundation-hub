# Theresa Foundation — Public Site + Donor Dashboard

Build the donor-facing platform: a premium public donation website and a donor portal, backed by a real Cloud backend with accounts, campaigns, donations and T-shirt orders. Payment is a realistic simulated checkout (M-Pesa, Airtel Money, Tigo Pesa, Visa, Mastercard) that produces a real donation record and receipt. Admin panel is out of scope for this phase.

Visual direction matches your screenshots: deep navy (#1E3A8A) primary, emerald (#10B981) for donate/success, gold (#F59E0B) accents, white / light gray (#F8FAFC) surfaces, dark slate text, Inter + Poppins, 12-16px rounded cards, soft shadows.

## Public website

- **Layout**: sticky navbar (logo, Home / About / Campaigns / Impact / T-Shirts / Contact, Login, Register, Donate Now), mobile slide-out menu, large footer with link columns and newsletter signup.
- **Home**: hero ("Together We Can Change Lives") with imagery and a floating impact stat card; animated impact counters (TZS raised, donors, volunteers, campaigns, beneficiaries) fed from real data; about preview with mission/vision/values cards; featured campaign grid with progress bars, raised vs goal, donor count, days left; "How donations help" allocation chart (Education 40 / Healthcare 25 / Community 20 / Admin 15); testimonial carousel; FAQ accordion; closing donation CTA.
- **Pages**: About, Campaigns (list + filters), Campaign detail, Impact, T-Shirts catalog, Contact (form saved to the backend), Donate, Login, Register.
- **Images**: generated photography-style imagery for hero, campaigns and T-shirt mockups.

## Donation flow

Multi-step wizard with a progress stepper, matching your screenshot:

1. Donor information (name, email, phone, country)
2. Amount — presets TZS 10,000 / 25,000 / 50,000 / 100,000 / custom; one-time or monthly
3. Campaign selector
4. T-shirt template (front/back, eligibility badge) — skippable if amount is below the eligibility threshold
5. Size (XS–XXL) with live inventory availability
6. Review summary
7. Payment method selection + simulated processing screen
8. Success: donation ID, receipt download, track donation, return home

Guests can donate without an account; if the email matches an account, the donation links to it.

## Donor dashboard

Sidebar portal (Dashboard, My Donations, My Campaigns, My T-Shirts, Receipts, Notifications, Profile, Settings):

- Stat cards: total donated, campaigns supported, T-shirts earned
- Donation trends line chart by month/year
- Recent donations table (ID, campaign, amount, date, status) with detail view and printable receipt
- My T-Shirts: template, size, quantity, plus a status timeline (Confirmed → Reserved → Processing → Ready → Shipped → Delivered)
- Notifications center, profile management, password update
- Featured campaign banner with progress, as in your screenshot

## Backend

Lovable Cloud is enabled for email/password auth plus tables for profiles, campaigns, donations, t-shirt templates, inventory, t-shirt orders, notifications and contact messages. Row-level security scopes each donor to their own donations, orders, receipts and notifications; campaigns and T-shirt templates are publicly readable. A separate roles table is created now (donor/admin) so the admin panel can be added later without a migration rewrite. Campaigns, testimonials and T-shirt templates are seeded with realistic content so the site is populated on first load.

## Technical notes

- TanStack Start routes; donor dashboard lives under the authenticated route group.
- Reads/writes go through server functions with TanStack Query; charts via Recharts.
- Design tokens defined in `src/styles.css` (oklch), no hardcoded colors in components.
- Payment step writes a donation with `completed`/`pending` status and reserves T-shirt inventory transactionally; no real gateway is called. Swapping in a real gateway later only touches the payment service.
- Per-route SEO metadata on every public page; fully responsive across desktop, tablet and mobile including tables and forms.

## Not in this phase

Admin dashboard, real payment gateway, refunds, exports (PDF/Excel/CSV), SMS/email template management.
