# Amazon Listing Optimizer

## Overview

An AI-powered web application that helps e-commerce professionals optimize Amazon product listings. The application scrapes product details from Amazon using ASINs, processes them through Google's Gemini 2.5 Flash AI model to generate improved content, and provides side-by-side comparison of original vs. optimized listings. All optimizations are stored in a database for historical tracking and analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type safety and component-based UI
- Wouter for lightweight client-side routing
- TanStack Query for server state management and data fetching
- React Hook Form with Zod for form validation
- Shadcn UI component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens

**Design System:**
- Linear/Notion-inspired productivity tool aesthetic
- Custom theme system with light/dark mode support
- Professional blue primary color (#3B82F6 in light mode)
- Inter font family for UI text, JetBrains Mono for technical data (ASINs)
- Consistent spacing using Tailwind units (2, 4, 6, 8, 12, 16)
- Card-based layouts with subtle borders and shadows

**State Management:**
- TanStack Query for server state caching and synchronization
- Local component state via React hooks
- Theme preference stored in localStorage

**Key Pages:**
1. Home (`/`) - ASIN input and optimization interface with side-by-side comparison
2. History (`/history`) - Accordion-based view of all past optimizations
3. 404 Not Found fallback

### Backend Architecture

**Technology Stack:**
- Node.js with Express framework
- TypeScript for type safety across the stack
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL driver with WebSocket support

**API Design:**
- RESTful endpoints under `/api` prefix
- POST `/api/optimize` - Main endpoint that orchestrates scraping, AI optimization, and storage
- GET `/api/history` - Retrieves all optimization records ordered by most recent

**Request Flow:**
1. Client submits ASIN via validated form
2. Server scrapes Amazon product page using Cheerio
3. Scraped data sent to Gemini AI for optimization
4. Original and optimized data stored in PostgreSQL
5. Complete record returned to client for display

**Error Handling:**
- Graceful error responses with appropriate HTTP status codes
- 400 for invalid ASINs or scraping failures
- 500 for AI processing or database errors
- Request logging middleware for debugging

### Database Architecture

**Database:** PostgreSQL (Neon serverless)

**Schema Design:**
- Single `optimizations` table with serial primary key
- ASIN stored as varchar(10) for quick lookups
- Original content fields: title, bullets (array), description
- Optimized content fields: title, bullets (array), description, keywords (array)
- PostgreSQL array types for bullet points and keywords
- Timestamp fields: createdAt (auto-set), updatedAt (auto-set)

**ORM Strategy:**
- Drizzle ORM chosen for type safety and zero-cost abstractions
- Schema defined in shared TypeScript for frontend/backend consistency
- Zod schemas generated from Drizzle schema for runtime validation
- Storage abstraction layer (`IStorage` interface) for testability

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations` directory
- `db:push` script for applying schema changes

### External Dependencies

**AI Service:**
- Google Gemini 2.5 Flash via `@google/genai` SDK
- Requires `GOOGLE_API_KEY` environment variable
- System prompt engineered to optimize for Amazon compliance
- Structured JSON output with exact schema requirements
- Optimizes: title (150-200 chars), 5 bullet points (150-200 chars each), description, 3-5 keywords

**Web Scraping:**
- Axios for HTTP requests with browser-like headers to avoid blocking
- Cheerio for HTML parsing and DOM manipulation
- Targets Amazon product pages at `https://www.amazon.com/dp/{ASIN}`
- Extracts: product title, feature bullets, description
- Multiple selector fallbacks for robustness

**Third-Party Libraries:**
- Radix UI: Unstyled accessible component primitives (dialogs, dropdowns, accordions, etc.)
- Shadcn UI: Pre-styled Radix components following design guidelines
- Tailwind CSS: Utility-first CSS framework with custom configuration
- Class Variance Authority: Type-safe variant management for components
- date-fns: Date formatting and manipulation

**Development Tools:**
- Vite for fast development server and optimized production builds
- ESBuild for bundling server code
- TypeScript compiler for type checking
- Replit-specific plugins for development experience (cartographer, dev banner, runtime error overlay)

**Environment Variables:**
- `DATABASE_URL` - Neon PostgreSQL connection string (required)
- `GOOGLE_API_KEY` - Gemini API key (required)
- `NODE_ENV` - Environment mode (development/production)