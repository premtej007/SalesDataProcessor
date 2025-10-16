# Amazon Listing Optimizer

An AI-powered web application that optimizes Amazon product listings using Google's Gemini 2.5 Flash model. The app fetches product details via web scraping, uses AI to generate improved content, and stores optimization history in a PostgreSQL database.

## Features

- **ASIN Product Fetching**: Automatically scrape Amazon product pages for title, bullet points, and description
- **AI-Powered Optimization**: Use Gemini 2.5 Flash to generate:
  - Keyword-rich, readable titles
  - Clear and concise bullet points
  - Persuasive, compliant descriptions
  - 3-5 relevant SEO keywords
- **Side-by-Side Comparison**: View original vs optimized content in an intuitive UI
- **Optimization History**: Track all optimizations with timestamps and full details
- **Responsive Design**: Clean, professional interface that works on all devices
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Shadcn UI** for component library
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express
- **Cheerio** for web scraping
- **Google Gemini 2.5 Flash** for AI optimization
- **PostgreSQL** with Drizzle ORM
- **TypeScript** for type safety

## Setup Instructions

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (provided by Replit)
- Google API Key for Gemini AI

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   
   The following environment variables are required:
   - `GOOGLE_API_KEY`: Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
   - `DATABASE_URL`: PostgreSQL connection string (auto-configured in Replit)

3. **Initialize Database**
   ```bash
   npm run db:push
   ```

4. **Start the Application**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

## Usage

1. **Enter an ASIN**: Input a 10-character Amazon Standard Identification Number (e.g., `B07H65KP63`)
2. **Click "Optimize Listing"**: The app will:
   - Scrape the product details from Amazon
   - Use Gemini AI to generate optimized content
   - Save the results to the database
3. **View Comparison**: See original vs optimized content side-by-side
4. **Check History**: Navigate to the History page to view all past optimizations

## AI Prompt Engineering

### Prompt Strategy

The application uses a carefully crafted system prompt for Gemini AI that ensures high-quality, consistent optimizations:

#### System Prompt Components:

1. **Role Definition**: 
   - Positions the AI as an "expert Amazon listing optimization specialist"
   - Sets clear expectations for output quality and compliance

2. **Optimization Guidelines**:
   - **Title**: Keyword-rich, readable, 150-200 characters
   - **Bullet Points**: Benefit-focused, clear, 5 bullets @ 150-200 chars each
   - **Description**: Persuasive, detailed, Amazon-compliant (no unsubstantiated claims)
   - **Keywords**: 3-5 relevant SEO terms not already in title

3. **Structured Output**:
   - Uses Gemini's JSON response format with schema validation
   - Ensures consistent, parseable results every time
   - Prevents hallucination with strict schema enforcement

#### Prompt Reasoning:

- **Amazon-Specific Expertise**: The prompt explicitly mentions Amazon guidelines to ensure compliance with platform rules (e.g., avoiding medical claims, misleading language)
  
- **SEO Focus**: Emphasizes keyword optimization and search visibility while maintaining readability
  
- **Conversion Optimization**: Instructs AI to make content benefit-focused and persuasive to improve conversion rates
  
- **Structured Output**: Using Gemini's response schema feature ensures reliable JSON parsing and prevents malformed responses
  
- **Context Preservation**: The user prompt includes all original content, allowing the AI to maintain product context while improving presentation

### Example Optimization Flow

**Original Title**: "Wireless Bluetooth Headphones"

**Optimized Title**: "Premium Wireless Bluetooth Headphones - Noise Cancelling, 40H Battery, Deep Bass, Comfortable Over-Ear Design for Music & Calls"

The AI adds relevant keywords (noise cancelling, battery life, bass quality) while maintaining readability and staying within Amazon's character limits.

## Architecture Decisions

### Web Scraping Approach

- **Cheerio over Puppeteer**: Lightweight, faster, lower resource usage
- **Multiple Selector Fallbacks**: Amazon frequently changes DOM structure; multiple selectors ensure reliability
- **Error Handling**: Graceful degradation with fallback content if scraping fails
- **User-Agent Headers**: Mimic browser requests to reduce blocking

### Database Schema

- **Single Table Design**: All optimization data in one `optimizations` table for simplicity
- **Array Columns**: PostgreSQL arrays for bullets and keywords (efficient storage, no joins needed)
- **Timestamps**: Track creation time for history and analytics
- **ASIN Indexing**: Although not explicitly created, ASINs are frequently queried

### Frontend Architecture

- **Component-Based**: Modular, reusable components (Home, History, shared UI components)
- **Type Safety**: Shared schemas between frontend/backend via Drizzle-Zod
- **Optimistic UI**: TanStack Query for efficient data fetching and caching
- **Progressive Disclosure**: History view uses accordions to show details on demand

## Challenges & Solutions

### Challenge 1: Amazon Anti-Scraping

**Problem**: Amazon actively blocks scrapers with CAPTCHAs and rate limiting

**Solution**: 
- Use realistic browser headers
- Implement multiple DOM selectors (Amazon changes their HTML frequently)
- Provide fallback content if scraping fails
- Timeout protection (10 seconds max)

### Challenge 2: AI Response Consistency

**Problem**: LLMs can produce inconsistent, non-parseable responses

**Solution**:
- Use Gemini's structured output with JSON schema
- Strict response format validation
- Error handling with user-friendly messages
- Fallback mechanisms for parsing failures

### Challenge 3: Performance

**Problem**: Scraping + AI inference can take 5-10 seconds

**Solution**:
- Show loading skeletons for better UX
- Async processing with proper error boundaries
- Frontend state management to prevent duplicate requests
- Database caching for repeat ASINs (future enhancement)

## Assumptions

1. **ASIN Format**: All ASINs are 10 characters (standard Amazon format)
2. **Product Availability**: Products are publicly accessible on Amazon.com
3. **Language**: All products are in English
4. **Network Access**: The server can access Amazon.com and Google AI API
5. **API Limits**: Google API key has sufficient quota for testing
6. **Single User**: No authentication/multi-tenancy in MVP (planned for future)

## Testing

### Test ASINs

- `B07H65KP63` - Sample product for testing
- `B0BDK62PDX` - Alternative test product

### Manual Testing Checklist

- [ ] Enter valid ASIN → should fetch and optimize
- [ ] Enter invalid ASIN → should show error
- [ ] View history → should display all optimizations
- [ ] Expand history item → should show full details
- [ ] Toggle dark mode → should persist across pages
- [ ] Mobile responsive → should work on small screens

## Future Enhancements

1. **Batch Processing**: Optimize multiple ASINs at once
2. **Export Functionality**: Download optimization reports (PDF/CSV)
3. **Analytics Dashboard**: Track trends and keyword performance
4. **User Accounts**: Save preferences and settings per user
5. **A/B Testing**: Compare multiple optimization versions
6. **Multi-Language Support**: Optimize for international marketplaces
7. **Chrome Extension**: Optimize directly from Amazon product pages

## API Endpoints

### POST /api/optimize
Scrape Amazon product, optimize with AI, and save to database

**Request Body**:
```json
{
  "asin": "B07H65KP63"
}
```

**Response**:
```json
{
  "id": 1,
  "asin": "B07H65KP63",
  "originalTitle": "...",
  "originalBullets": ["...", "..."],
  "originalDescription": "...",
  "optimizedTitle": "...",
  "optimizedBullets": ["...", "..."],
  "optimizedDescription": "...",
  "suggestedKeywords": ["...", "..."],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### GET /api/history
Get all optimization history

**Response**: Array of optimization objects

### GET /api/history/:asin
Get optimization history for specific ASIN

**Response**: Array of optimization objects for the ASIN

## License

MIT

## Contact

For questions or support, please open an issue on GitHub.
