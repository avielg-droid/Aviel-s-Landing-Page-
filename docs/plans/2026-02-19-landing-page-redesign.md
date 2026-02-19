# Landing Page Redesign — "Growth Dashboard"
**Date:** 2026-02-19
**Project:** Aviel Gendler — Amazon Seller Specialist
**File:** `/Users/aviel/Desktop/my-first-project/index.html`

---

## Design Direction

**Concept:** Transform the page from a generic dark freelancer template into a live Amazon analytics console. Visitors feel like they've logged into a premium performance tool, not browsed another portfolio.

**Design language:** Data dashboard + editorial typography + terminal aesthetic

---

## Visual Identity

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background (near-black, replaces navy) |
| `--surface` | `#111111` | Panel backgrounds |
| `--card` | `#161616` | Campaign rows, cards |
| `--border` | `#222222` | Dividers, borders |
| `--green` | `#00ff87` | Primary accent — live indicators, success, data |
| `--orange` | `#ff9900` | Amazon brand recognition — used sparingly |
| `--blue` | `#00d4ff` | Secondary data/metrics color |
| `--text` | `#f5f5f5` | Body text |
| `--muted` | `#666666` | Secondary text |

### Typography
- **Headlines:** Syne (geometric, technical, distinctive)
- **Body:** Inter (clean readability)
- **Data/numbers:** JetBrains Mono (terminal/real-data feel)

---

## Layout Structure

### 1. Nav
- Minimal black bar
- Logo: `AG_` in JetBrains Mono with blinking cursor animation
- Right side: pulsing green dot + `AVAILABLE` status label
- Nav links styled as simple uppercase labels

### 2. Hero — Split Layout
**Left 55%:**
- Tiny monospace label: `01 / SPECIALIST`
- Massive Syne headline: "The Amazon Operator That Moves Numbers"
- Subtext description
- CTA buttons styled as terminal commands: `> start_project` and `> view_services`

**Right 45%: "Live Performance Panel"**
- Dark widget card
- Header: `CLIENT PORTFOLIO // LIVE` with blinking green dot
- 4 animated stats (counter animation as if fetching from API):
  - `150+` Brands Scaled
  - `$10M+` Revenue Generated
  - `98%` Client Satisfaction
  - `7+` Years Experience
- Thin sparkline mini-charts beside each stat
- Status badges: `LISTING ● ACTIVE`, `PPC ● RUNNING`, etc.

### 3. Marquee Ticker
- Restyled as stock market ticker
- Dark bar, green JetBrains Mono text scrolling
- `▲` arrows beside service keywords
- Format: `▲ Listing Optimization  ▲ PPC Management  ▲ Product Launch ...`

### 4. Services — "Campaign Rows"
**Replaces the card grid entirely.** 6 rows styled like an active campaign manager table:
- Each row: `[01]` → Service Name → Short description → `● ACTIVE` green badge
- Row hover: green left border highlight + slight background lift
- Staggered "table populating" animation on scroll (rows load in one by one)

Services:
1. Listing Optimization
2. PPC Campaign Management
3. Product Launch Strategy
4. Analytics & Reporting
5. Brand Registry & Protection
6. Inventory & Logistics

### 5. About / Photo Section (NEW)
**Split layout:**
- Right side: Personal photo with dark overlay + green border frame effect
- Left side:
  - Personal statement (1–2 sentences)
  - 3–4 credential highlights styled as "verified metrics" with green checkmarks

### 6. Why Me — "Performance Report" Style
- 4 items styled as audit findings
- Each item has a bold highlighted metric in green
- Kept as 2-column grid but with dashboard aesthetic

### 7. CTA Band — Terminal Prompt
- Visual centerpiece: `$ aviel --start-project`
- Subtext description
- Contact buttons styled as console command buttons:
  - `> send_email`
  - `> open_linkedin`
  - `> message_whatsapp`

### 8. Footer
- Ultra-minimal
- `SYSTEM STATUS: ONLINE ●` green indicator
- Copyright line
- Social links

---

## Animations & Interactions

- Stats counter animates as if "fetching" from an API (fast tick-up)
- Blinking cursor on nav logo `AG_`
- Green pulsing dot on nav `AVAILABLE` status
- `● LIVE` blinking indicator on performance panel header
- Campaign rows stagger-load on scroll (like table rows populating)
- Row hover: instant green left border + background highlight
- CTA buttons: terminal-style hover with `>_` cursor prefix
- Subtle dot-grid or circuit pattern in hero background (replaces orbs)
- No floating orbs, no glassmorphism blur cards

---

## Content Changes

- All existing copy preserved
- Hero headline updated to: *"The Amazon Operator That Moves Numbers"*
- Photo section added (new)
- Services reformatted as rows (same 6 services, same descriptions)
- CTA/contact info unchanged

---

## Technical Notes

- Single HTML file (no build tools, same as current)
- Google Fonts: add Syne + JetBrains Mono
- All animations via CSS + vanilla JS (IntersectionObserver for scroll)
- Responsive: mobile collapses split layouts to stacked
