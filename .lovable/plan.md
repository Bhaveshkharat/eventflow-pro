
# Multi-Tenant Event & Expo Management SaaS — Frontend Plan

A premium, Apple-inspired SaaS UI with glassmorphism, smooth motion, and mock data only. No backend, no auth logic, no DB.

> Note on stack: this Lovable template uses **TanStack Start (React 19 + Vite + TS + Tailwind v4 + shadcn/ui)** rather than Next.js. The visual result, component structure, and code quality match the Next.js spec — only the routing primitive differs (`@tanstack/react-router` file-based routes instead of Next's `app/`). Everything else (React, TS, Tailwind, shadcn, Framer Motion, Lucide) is identical.

## Design Language

- **Palette (light/dark)**: near-white / near-black backgrounds with a subtle violet→cyan gradient accent. Frosted surfaces using `backdrop-blur` + translucent borders + soft layered shadows.
- **Typography**: Inter for UI, tighter tracking on display headings, generous line-height.
- **Tokens** (added to `src/styles.css`): `--surface-glass`, `--border-glass`, `--shadow-elegant`, `--shadow-glow`, `--gradient-primary`, `--gradient-mesh`, plus chart colors. All components consume tokens — no hardcoded colors.
- **Motion**: Framer Motion only for hero, page transitions, stat counters, modal/drawer, and card hover lift. CSS for everything else (shimmer, fade-in, hover-scale).
- **Loading**: shimmer skeletons (CSS keyframes) reused across cards, tables, charts.

## Routes (TanStack file-based, under `src/routes/`)

Public:
- `index.tsx` — Landing
- `events.tsx` — Events listing (filters, search, grid)
- `events.$eventId.tsx` — Event details (banner, agenda, tickets, hotels, CTA)
- `pricing.tsx` — Subscription plans
- `register.tsx` — Multi-step registration flow
- `book.$eventId.tsx` — Ticket booking flow + QR preview on success

Dashboard layout `_app.tsx` (sidebar + topbar + Outlet):
- `_app/visitor.tsx`
- `_app/exhibitor.tsx`
- `_app/organizer.tsx`
- `_app/hotel-travel.tsx`
- `_app/analytics.tsx`
- `_app/qr-verify.tsx`
- `_app/notifications.tsx`
- `_app/settings.tsx`

A role switcher in the sidebar lets users jump between Visitor/Exhibitor/Organizer/Hotel dashboards (since there's no real auth).

## Component Architecture

`src/components/`
- `layout/` — `MarketingNav`, `Footer`, `DashboardShell`, `Sidebar`, `Topbar`, `MobileDrawer`, `ThemeToggle`, `RoleSwitcher`, `PageTransition`
- `ui-ext/` — `GlassCard`, `GradientButton`, `StatCard` (animated counter), `SectionHeading`, `ShimmerSkeleton`, `EmptyState`, `SearchInput`, `DataTable`, `Modal`, `Toaster` wiring (sonner)
- `charts/` — `RevenueAreaChart`, `RegistrationsBarChart`, `TicketDonut` (recharts, themed via tokens)
- `events/` — `EventCard`, `EventBanner`, `TicketTierCard`, `HotelCard`, `AgendaTimeline`, `FeaturedCarousel`
- `flows/` — `RegistrationStepper`, `BookingSummary`, `QRTicket`
- `dashboard/` — role-specific widget panels composed from `StatCard` + charts + tables

`src/data/mock.ts` — single source of dummy JSON: events, tickets, hotels, attendees, exhibitors, revenue series, notifications, plans.

`src/hooks/` — `useTheme` (class on `<html>`, localStorage), `useRole`.

## Page Highlights

- **Landing**: full-bleed gradient mesh hero with frosted glass CTA card, featured events carousel, animated stats strip, three-tier pricing preview, testimonials grid, footer.
- **Event Details**: sticky banner, two-column layout (agenda + sticky ticket purchase card), hotel/travel recommendation row, share + add-to-calendar.
- **Dashboards**: 4 stat cards top, two charts middle, recent activity table + side panel. Hotel/Travel adds room inventory + booking list. Organizer adds revenue breakdown and exhibitor approvals.
- **QR Verify**: large scanner-style card (mocked camera frame) + recent scans list + status toasts.
- **Registration / Booking**: multi-step with progress, smooth slide transitions, summary sidebar, success state with animated QR.
- **Settings**: tabs for Profile, Organization, Billing, Notifications, Appearance (theme).

## Global UX

Sticky frosted navbar, mobile drawer (Sheet), command-palette-style search input, sonner toasts, page transition wrapper, shimmer skeletons on all data surfaces, empty states with illustration glyphs.

## Out of Scope

No real auth, no API routes, no DB, no payment integration — all interactions resolve against mock data with simulated latency for skeleton demos.

## Deliverable

Production-quality frontend across all 15 pages, fully responsive, dark/light mode, consistent token-driven design system, reusable components, no placeholder content remaining.
