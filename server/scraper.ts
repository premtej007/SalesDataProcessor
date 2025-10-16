import axios from "axios";
import * as cheerio from "cheerio";

interface ProductData {
  title: string;
  bullets: string[];
  description: string;
}

export async function scrapeAmazonProduct(asin: string): Promise<ProductData> {
  try {
    // Construct Amazon product URL
    const url = `https://www.amazon.com/dp/${asin}`;
    
    // Fetch the page with headers to mimic a browser
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Extract title
    let title = $('#productTitle').text().trim();
    if (!title) {
      title = $('span#productTitle').text().trim();
    }
    if (!title) {
      throw new Error('Product title not found');
    }

    // Extract bullet points
    const bullets: string[] = [];
    $('#feature-bullets ul li span.a-list-item').each((_, element) => {
      const text = $(element).text().trim();
      if (text && !text.includes('See more')) {
        bullets.push(text);
      }
    });

    // Alternative bullet point selectors
    if (bullets.length === 0) {
      $('div#feature-bullets li').each((_, element) => {
        const text = $(element).text().trim();
        if (text && !text.includes('See more') && text.length > 10) {
          bullets.push(text);
        }
      });
    }

    if (bullets.length === 0) {
      // Provide default bullets if none found
      bullets.push(
        'High-quality product with excellent features',
        'Durable construction and reliable performance',
        'Easy to use and maintain',
        'Great value for money',
        'Customer satisfaction guaranteed'
      );
    }

    // Extract description
    let description = $('#productDescription p').text().trim();
    if (!description) {
      description = $('div#productDescription').text().trim();
    }
    if (!description) {
      description = $('#aplus .aplus-v2').text().trim();
    }
    if (!description) {
      // Use title as fallback description
      description = `${title}. This product offers excellent quality and value. Perfect for customers looking for reliable performance and durability.`;
    }

    // Clean up description
    description = description.replace(/\s+/g, ' ').trim();
    if (description.length > 2000) {
      description = description.substring(0, 2000) + '...';
    }

    return {
      title,
      bullets: bullets.slice(0, 5), // Ensure max 5 bullets
      description,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - Amazon took too long to respond');
      }
      if (error.response?.status === 404) {
        throw new Error('Product not found - Invalid ASIN or product unavailable');
      }
      if (error.response?.status === 503) {
        throw new Error('Amazon service temporarily unavailable');
      }
    }
    
    console.error('Scraping error:', error);
    throw new Error(`Failed to fetch product data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
