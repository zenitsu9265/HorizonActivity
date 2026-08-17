# HorizonActivity

A full-stack activity-booking marketplace built with **Next.js 16** (App Router), **Tailwind CSS v4**, **Prisma 7**, and **SQLite**. Users buy discounted prepaid "booking cards" via Razorpay test payments, receive wallet credit, and use it to book activities (crafting, rafting, bungee jumping, etc.) at popular Indian places on a chosen date. Includes user accounts and a complete admin panel.

## Features

- **User accounts** — register/login/logout with bcrypt-hashed passwords and JWT in an httpOnly cookie (`ha_session`); roles `USER` / `ADMIN`; origin checks on mutating routes (CSRF protection).
- **Booking cards** — prepaid card plans (e.g. ₹2,000 card for ₹1,800). Payment is handled in Razorpay **test mode** via the [Razorpay Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/) flow; the server verifies the signature and credits the wallet.
- **Wallet** — all money stored in paise (integers); every credit/debit produces a ledger `Transaction` row.
- **Bookings** — pick an activity and a date; the amount is deducted from the wallet. Cancellation (up to the booking date) refunds the wallet.
- **Public catalog** — home page with hero/featured sections, activity & place listings with search/filter, detail pages with JSON-LD structured data, booking-cards page, about/contact/how-it-works.
- **Admin panel** (`/admin`) — dashboard stats plus CRUD for places, activities, and card plans, and read-only listings of bookings, card orders, and users; role toggling and admin creation.

## Tech Stack

- Next.js 16.3 (App Router, React 19, Route Handlers + Server Actions)
- Tailwind CSS v4 (CSS-first config in `app/globals.css`, lucide-react icons)
- Prisma 7 (`prisma-client` generator, `@prisma/adapter-better-sqlite3` driver adapter)
- SQLite database
- zod v4 validation, bcryptjs, jose (JWT), Razorpay Node SDK

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in the values in `.env`:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | SQLite file path, e.g. `file:./prisma/dev.db` |
| `AUTH_SECRET` | Long random string used to sign session JWTs |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay test key id (`rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials for the seeded admin account |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap/SEO |

> **Razorpay test mode:** create a test key pair at https://dashboard.razorpay.com/app/keys. With the placeholder keys the site still works — buying a card returns a clear "Payment gateway is not configured" message.

### 3. Set up the database

```bash
npm run db:push   # create tables from prisma/schema.prisma
npm run seed      # admin + demo users, places, activities, card plans, sample data
```

### 4. Run the app

```bash
npm run dev
# or production:
npm run build && npm start
```

Open http://localhost:3000.

## Seeded Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@horizonactivity.in` | `Admin@1234` |
| Demo user | `demo@horizonactivity.in` | `Demo@1234` |

The demo user starts with a ₹1,850 wallet and a few existing bookings/orders so account pages are populated.

## Testing a Purchase (Razorpay test mode)

1. Set real test keys in `.env` and restart.
2. Sign in (any account) → `/booking-cards` → **Buy for ₹1,800**.
3. The Razorpay checkout opens in test mode. Use the official test card, e.g. **card number `4111 1111 1111 1111`, any future expiry, CVV `111`** (or use UPI test IDs).
4. After payment you are redirected to `/account/cards?paid=<orderNumber>`, which triggers the server-side signature verification and wallet credit.

## Useful Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run db:push      # sync Prisma schema to SQLite
npm run seed         # (re)seed database
```

## Project Structure

```
prisma/
  schema.prisma      # User, Place, Activity, Booking, CardPlan, CardOrder, Transaction
  seed.ts            # seed data
src/
  lib/               # prisma client, auth, razorpay, api helpers, zod validators, utils
  app/
    page.tsx         # home
    activities/      # listing + detail
    places/          # listing + detail
    booking-cards/   # card plans + Razorpay checkout
    account/         # profile, bookings, cards, transactions
    admin/           # dashboard, CRUD managers, server actions
    api/             # auth, bookings, payments route handlers
    sitemap.ts robots.ts icon.svg
  components/        # ui/, layout/, admin/, account/, feature widgets
```

## API Reference

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a user account |
| POST | `/api/auth/login` | Sign in, sets `ha_session` cookie |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user profile + wallet |
| POST | `/api/bookings` | Create a booking (`activityId`, `date`) — debits wallet |
| POST | `/api/bookings/cancel` | Cancel a booking (`bookingId`) — refunds wallet |
| POST | `/api/payments/create-order` | Create a Razorpay order (`cardPlanId`) |
| POST | `/api/payments/verify` | Verify Razorpay signature, mark order paid, credit wallet |

All mutating routes require an active session and reject cross-origin requests.
