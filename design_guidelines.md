# Design Guidelines: Amazon Product Listing Optimizer

## Design Approach: Productivity Tool System

**Selected Framework**: Linear/Notion-inspired design system - clean, functional, data-focused with subtle depth
**Rationale**: This is a utility-first application for e-commerce professionals requiring efficient data comparison, clear information hierarchy, and reliable performance over visual spectacle.

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: 0 0% 100% (pure white)
- Surface: 240 5% 96% (subtle gray for cards)
- Border: 240 6% 90% (defined borders)
- Text Primary: 240 10% 4% (near black)
- Text Secondary: 240 4% 46% (muted gray)
- Primary Action: 221 83% 53% (professional blue)
- Success/Optimized: 142 71% 45% (green for improved content)
- Warning: 38 92% 50% (amber for alerts)

**Dark Mode:**
- Background: 240 10% 4% (deep charcoal)
- Surface: 240 6% 10% (elevated surfaces)
- Border: 240 4% 16% (subtle borders)
- Text Primary: 0 0% 98% (near white)
- Text Secondary: 240 5% 65% (muted)
- Primary Action: 217 91% 60% (bright blue)
- Success/Optimized: 142 76% 36% (darker green)
- Warning: 38 92% 50% (amber)

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - for all UI text, clean and highly readable
- Monospace: 'JetBrains Mono' (Google Fonts) - for ASINs and technical data

**Type Scale:**
- Headings: font-semibold text-2xl to text-4xl (page titles)
- Subheadings: font-medium text-lg to text-xl (section headers)
- Body: font-normal text-base (main content)
- Captions: font-normal text-sm (metadata, timestamps)
- Labels: font-medium text-sm (form labels, tags)

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing (gaps, padding): p-2, p-4, gap-2, gap-4
- Component spacing: p-6, p-8, m-6, m-8
- Section spacing: py-12, py-16, mt-12, mb-16

**Grid Structure:**
- Max container width: max-w-7xl mx-auto
- Comparison layout: grid grid-cols-1 lg:grid-cols-2 gap-8
- History cards: grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6

### D. Component Library

**Input & Forms:**
- ASIN input: Large, centered text input with monospace font
- Search button: Primary color, rounded-lg, px-8 py-3
- Form containers: Subtle borders, rounded-xl, shadow-sm
- Input states: Distinct focus rings (ring-2 ring-primary), error states in warning color

**Comparison Cards:**
- Side-by-side containers with equal height
- Original content: Neutral background (surface color)
- Optimized content: Subtle success tint (success color at 5% opacity on background)
- Clear "Original" vs "Optimized" labels with badges
- Rounded-lg borders with shadow-md for depth

**Data Display:**
- Bullet points: Custom styled with success color markers for optimized version
- Keywords: Pill-shaped tags with subtle backgrounds (badge-like)
- Diff indicators: Subtle green highlights for improvements
- Timestamps: Small, muted text in captions style

**History Interface:**
- Timeline view with vertical connector lines
- Card-based history entries with hover states (translate-y-[-2px] transition)
- Expandable sections for detailed comparison
- Filter/sort controls in clean button group

**Navigation:**
- Top navbar: Sticky, backdrop-blur effect, border-b
- Tabs for switching views: Underline active state
- Breadcrumbs: For history navigation

**Feedback & Status:**
- Loading states: Skeleton loaders matching content structure
- Success messages: Toast notifications, top-right placement
- Error handling: Inline error messages with warning color
- Empty states: Centered, with helpful illustrations and CTAs

### E. Interactions

**Micro-interactions:**
- Button hover: Subtle brightness increase (hover:brightness-110)
- Card hover: Shadow elevation increase (hover:shadow-lg)
- Smooth transitions: transition-all duration-200
- Focus states: Clear ring indicators for accessibility

**Animations**: Minimal and purposeful only
- Page transitions: Fade-in (opacity 0 to 1, 300ms)
- Card reveals: Stagger effect for history items (delay-[100ms] increments)
- Loading spinners: Subtle rotation for fetch operations

---

## Key Design Patterns

**Comparison View Strategy:**
- Equal-width columns on desktop (50/50 split)
- Stack vertically on mobile with clear visual separation
- Sticky headers showing "Original" and "Optimized" labels
- Inline highlighting of key differences

**Data Density Management:**
- Progressive disclosure: Show summary first, expand for details
- Visual grouping: Bordered sections for title, bullets, description
- Whitespace discipline: Generous padding between major sections (py-8)
- Typography hierarchy: Size and weight differentiation for scannability

**Responsive Behavior:**
- Mobile: Single column, stacked comparison (Original → Optimized)
- Tablet: Begin side-by-side with reduced gutters
- Desktop: Full side-by-side with comfortable spacing

**Trust & Credibility:**
- Professional color scheme avoiding playful elements
- Consistent spacing and alignment throughout
- Clear labeling of AI-generated vs original content
- Visible timestamps and version tracking

---

## Images

This application does not require hero images or decorative imagery. Focus on:
- Empty state illustrations: Simple line-art SVGs for "No history yet" states
- Icon system: Heroicons for UI actions (search, history, refresh, expand)
- Status indicators: Check marks, loading spinners, error icons
- Potential: Small product thumbnail if scraped from Amazon (optional enhancement)