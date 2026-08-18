# Izifacture Design System & Rules

This rule dictates the design, layout, responsiveness, and animation standards to follow throughout the creation and iteration of the Izifacture SaaS application.

## 1. Responsiveness (Mobile & Desktop)
- **Mobile-First Layout**: Always ensure pages are fully usable on mobile screens (`sm` breakpoints).
- **Navigation**: Use a fixed bottom navigation bar on mobile (via `components/layout/sidebar.tsx` adapting for mobile) and a standard left sidebar on desktop (`md` breakpoint and above).
- **Overflow Handling**: Any table or wide data element MUST be wrapped in a container with `overflow-x-auto` to prevent horizontal scrolling on the page body.
- **Grids**: Use `grid-cols-1` for mobile, transitioning to `md:grid-cols-2` or `md:grid-cols-4` on larger screens.

## 2. Animations & Micro-interactions
- **Instant Click & Hover Feedback**: All buttons must implement `active:scale-[0.98]` along with `hover:scale-105` and `transition-all` for an immediate tactile feel when clicked and a smooth zoom-in effect when hovered.
- **Hover States (Cards)**: All Cards (`components/ui/card.tsx`) and actionable blocks must include a subtle hover effect: `hover:-translate-y-1 hover:shadow-md transition-all duration-300`.
- **Page Transitions**: Content containers or major sections should animate in on load using custom Tailwind v4 animations defined in `globals.css` (e.g., `animate-fade-slide-up`).
- **Table Rows**: Table rows (`<TableRow>`) must have hover effects (`hover:bg-muted/50 transition-colors duration-200`) to highlight the active row.

## 3. Styling Aesthetics
- **Colors**: Rely on the defined CSS variables (`--primary` for the main green).
- **Typography**: Emphasize hierarchy (large bold titles, muted foreground text for descriptions).
- **Visual Feedback**: Every user action (like saving settings or creating an invoice) should yield an immediate result on screen without manual refresh.
