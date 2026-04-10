# Frontend System Spec (`aronetend.md`)

This document defines the frontend architecture, route flow, API endpoint mapping, styling system, button rules, and performance strategy for the **Course Content Version Control System**.

---

## 1) Frontend Goal

Build a high-performance, modern web frontend with:
- Instant-feel navigation
- Professional dark-theme UI
- Reusable design system
- Fast loading using lazy routes + skeleton screens

Framework target:
- **Next.js (App Router)**
- **Tailwind CSS v3+**

---

## 2) Theme and Visual Design Rules

### Core Color Palette
- Deep Navy Blue: `#0a192f` (main surfaces, nav, header/footer)
- Vibrant Orange/Gold: `#f59e0b` (buttons, highlights, CTAs)
- White: `#ffffff` (primary text on dark backgrounds)
- Light Gray: `#e2e8f0` (secondary text)
- Slate Blue: `#1e293b` (cards, dividers, structural containers)

### Tailwind Theme Extension (required)

Add to `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      brand: {
        navy: "#0a192f",
        slate: "#1e293b",
        gold: "#f59e0b",
        light: "#e2e8f0",
        white: "#ffffff",
      },
    },
  },
}
```

### Typography and Spacing
- Headings: semibold/bold, high contrast (`text-brand-white`)
- Body text: `text-brand-light`
- Minimum section spacing: `py-10` desktop, `py-6` mobile
- Containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Surface Rules
- App background: `bg-brand-navy`
- Cards/panels: `bg-brand-slate border border-slate-700/60`
- Inputs: dark with gold focus ring

---

## 3) Route Structure (Frontend Pages)

Use **client-side transitions** with `next/link` and avoid full page reloads.

### Public Routes
- `/login` -> Login page

### Protected Routes
- `/dashboard` -> Main dashboard (teacher or student view by role)
- `/profile` -> User profile and account details
- `/courses/[courseId]` -> Course details
- `/files/[fileId]` -> File details + version timeline
- `/files/[fileId]/compare` -> Compare versions UI

### Route UX Rules
- Route changes must feel instant:
  - Use `next/link` prefetch
  - Keep layout persistent in App Router
  - Show skeleton fallback instead of spinner-only pages

---

## 4) API Endpoints Mapping (Frontend Integration)

Frontend should call these endpoints and normalize responses via a single API client (`lib/api-client.ts`).

## Auth
- `POST /api/auth/login`
  - body: `{ email, password }`
  - success: `{ token, user }`
- `POST /api/auth/logout`

## Courses
- `GET /api/courses`
- `GET /api/courses/:courseId`
- `POST /api/courses`

## Files and Versions
- `POST /api/files/upload` (new file v1)
- `POST /api/files/:fileId/versions` (new version)
- `GET /api/files/:fileId`
- `GET /api/files/:fileId/versions`
- `GET /api/files/:fileId/versions/:version/download`
- `GET /api/files/:fileId/compare?v1=1&v2=2`
- `POST /api/files/:fileId/rollback`

### Frontend Error Handling Contract
- `400` -> show inline form errors
- `401` -> redirect to `/login`
- `403` -> show "permission denied" alert state
- `404` -> route-level empty/not-found state
- `500` -> show retry card with support message

---

## 5) Page-by-Page UI Specifications

## A) Login Page (`/login`)

### Layout
- Full-screen split card layout
- Left: branding + product value
- Right: secure login form
- Background: gradient from `brand.navy` to darker slate

### Inputs
- Rounded (`rounded-lg`)
- Smooth transitions (`transition-all duration-200`)
- Focus ring in gold (`focus:ring-2 focus:ring-brand-gold`)
- Placeholder in muted gray

### UX states
- Disabled button during submit
- Inline validation messages
- "Signing in..." state with subtle loader

## B) Dashboard (`/dashboard`)

### Layout
- Sticky top navbar
- Left sidebar (courses, quick actions)
- Main content cards (recent updates, version stats, actions)

### Cards
- `bg-brand-slate rounded-xl shadow-lg`
- Hover elevation: `hover:shadow-xl transition`
- CTA button always gold

### Data widgets
- Total courses
- Files updated this week
- Latest version activities

## C) Profile Page (`/profile`)

### Sections
- User info card
- Role and permissions
- Recent activity timeline
- Account actions

### Styling
- Keep same dark-gold theme consistency
- Editable fields with clear save/cancel actions

---

## 6) Button Design System (Mandatory)

All primary buttons must use:
- Background: `#f59e0b`
- Text: `#ffffff`
- Radius: slight round (`rounded-md` or `rounded-lg`)
- Hover: brightness/scale transition

### Primary Button Class

```txt
inline-flex items-center justify-center rounded-md
bg-brand-gold text-brand-white font-medium
px-4 py-2 shadow-sm
transition duration-200 ease-out
hover:brightness-110 hover:scale-[1.02]
active:scale-[0.99]
focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy
disabled:opacity-60 disabled:cursor-not-allowed
```

### Secondary Button Class
- Transparent or slate background
- Gold border/text on hover

```txt
inline-flex items-center justify-center rounded-md
border border-brand-gold/70 text-brand-light
px-4 py-2 transition duration-200
hover:bg-brand-gold hover:text-brand-white
```

### Destructive Button (if needed)
- Keep danger actions distinct (`bg-red-600`) and confirm with modal

---

## 7) Component System (Reusable UI)

Create reusable components:
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Card.tsx`
- `components/ui/Skeleton.tsx`
- `components/layout/AppShell.tsx`
- `components/files/VersionTimeline.tsx`
- `components/files/ComparePanel.tsx`

Rules:
- No inline random styles; use shared classes/variants
- Keep component props typed and minimal
- Use composition over duplication

---

## 8) Performance Plan (High Priority)

## Route-level Code Splitting
- Lazy-load heavy pages:
  - compare page
  - dashboard analytics widgets
  - profile activity timeline

Use `next/dynamic` for non-critical widgets.

## Data Fetching
- Use parallel fetching for dashboard cards
- Cache with SWR/React Query (recommended)
- Keep responses normalized in one client layer

## Skeleton Loading
- Show skeleton blocks immediately on route/data load
- Replace with content as data resolves
- Avoid blank screens

## Image Optimization
- Use `next/image`
- Correct width/height
- Use compressed assets and lazy loading

## Rendering Strategy
- Prefer server components for static content
- Use client components only for interactive sections
- Memoize expensive render blocks where needed

---

## 9) Navigation and Instant Route Behavior

To achieve "super-fast" feel:
- Use `Link` for all internal navigation
- Keep shared layout persistent (`app/(protected)/layout.tsx`)
- Prefetch key routes (dashboard, profile, common course pages)
- Avoid blocking route transitions with synchronous heavy logic
- Defer non-critical data with skeleton placeholders

---

## 10) Accessibility and Quality Rules

- Contrast must remain high (light text on dark surfaces)
- Every input has label + error text
- Keyboard focus visible on all interactive controls
- Buttons have clear disabled and loading states
- Use semantic headings (`h1`, `h2`) and landmarks (`nav`, `main`)

---

## 11) Suggested Frontend Folder Structure

```txt
app/
  (public)/
    login/
      page.tsx
  (protected)/
    dashboard/
      page.tsx
    profile/
      page.tsx
    courses/[courseId]/
      page.tsx
    files/[fileId]/
      page.tsx
    files/[fileId]/compare/
      page.tsx
  layout.tsx
  globals.css

components/
  ui/
    Button.tsx
    Input.tsx
    Card.tsx
    Skeleton.tsx
  layout/
    AppShell.tsx
    Navbar.tsx
    Sidebar.tsx
  files/
    VersionTimeline.tsx
    ComparePanel.tsx

lib/
  api-client.ts
  auth.ts
  constants.ts
```

---

## 12) Build Priority Order

1. Theme and base layout
2. Login page with secure form behavior
3. Dashboard shell with real data wiring
4. Profile page
5. Version timeline screen
6. Compare screen
7. Skeleton states + dynamic imports optimization

---

## 13) Acceptance Checklist

- [ ] Dark navy + gold design implemented consistently
- [ ] Login, Dashboard, Profile pages built
- [ ] Route changes use client-side navigation
- [ ] Primary buttons follow defined button system
- [ ] Lazy loading and code splitting enabled
- [ ] Skeleton loaders appear on page/data load
- [ ] Endpoint integrations match backend contracts
- [ ] UI remains responsive and accessible

---

## 14) Notes for Team

- Keep all new UI code in ES6+ syntax.
- Use Tailwind classes only for styling consistency.
- Follow one shared component system to avoid design drift.
- Prioritize a stable, fast demo over adding too many extra features.
