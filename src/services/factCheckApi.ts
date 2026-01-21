/**
 * Google Fact Check Tools API Service
 * Optional integration - gracefully degrades if no API key is configured
 */

export interface FactCheckResult {
  available: boolean;
  claims: FactCheckClaim[];
  error?: string;
}

export interface FactCheckClaim {
  text: string;
  claimant?: string;
  claimDate?: string;
  rating: string;
  ratingValue?: number; // Normalized 0-100, lower = more false
  url: string;
  publisher: string;
  reviewDate?: string;
}

const API_BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

// Cache to avoid repeated API calls for same queries
const cache = new Map<string, { result: FactCheckResult; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Check if the Google Fact Check API is configured
 */
export function isFactCheckApiAvailable(): boolean {
  const apiKey = import.meta.env.VITE_GOOGLE_FACTCHECK_API_KEY;
  return Boolean(apiKey && apiKey.length > 0);
}

/**
 * Normalize various rating texts to a numeric value (0-100, lower = more false)
 */
function normalizeRating(textualRating: string): number | undefined {
  const rating = textualRating.toLowerCase();
  
  // True ratings
  if (rating.includes('true') && !rating.includes('false') && !rating.includes('partly') && !rating.includes('mostly')) {
    return 10;
  }
  if (rating.includes('mostly true') || rating.includes('largely true')) {
    return 25;
  }
  
  // Mixed ratings
  if (rating.includes('half true') || rating.includes('mixture') || rating.includes('partly') || rating.includes('partially')) {
    return 50;
  }
  
  // False ratings
  if (rating.includes('mostly false') || rating.includes('largely false')) {
    return 75;
  }
  if (rating.includes('false') || rating.includes('fake') || rating.includes('pants on fire') || rating.includes('incorrect')) {
    return 90;
  }
  
  // Other indicators
  if (rating.includes('misleading') || rating.includes('out of context')) {
    return 70;
  }
  if (rating.includes('unproven') || rating.includes('unverified')) {
    return 50;
  }
  if (rating.includes('satire')) {
    return 85;
  }

  return undefined;
}

/**
 * Extract search query from text (first ~200 chars or first sentence)
 */
function extractSearchQuery(text: string): string {
  // Try to get the first sentence
  const sentenceMatch = text.match(/^[^.!?]+[.!?]/);
  if (sentenceMatch && sentenceMatch[0].length >= 20) {
    return sentenceMatch[0].slice(0, 200);
  }
  
  // Otherwise just take first 200 chars
  return text.slice(0, 200);
}

/**
 * Query the Google Fact Check API for claims related to the text
 */
export async function checkFactsWithGoogle(text: string): Promise<FactCheckResult> {
  // Check if API is available
  if (!isFactCheckApiAvailable()) {
    return {
      available: false,
      claims: [],
      error: 'Google Fact Check API key not configured'
    };
  }

  const query = extractSearchQuery(text);
  const cacheKey = query.toLowerCase().trim();

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_FACTCHECK_API_KEY;

  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.set('query', query);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('languageCode', 'en');
    url.searchParams.set('pageSize', '5');

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    const claims: FactCheckClaim[] = (data.claims || []).map((claim: any) => {
      const review = claim.claimReview?.[0];
      const textualRating = review?.textualRating || 'Unknown';
      
      return {
        text: claim.text || '',
        claimant: claim.claimant,
        claimDate: claim.claimDate,
        rating: textualRating,
        ratingValue: normalizeRating(textualRating),
        url: review?.url || '',
        publisher: review?.publisher?.name || 'Unknown',
        reviewDate: review?.reviewDate
      };
    });

    const result: FactCheckResult = {
      available: true,
      claims
    };

    // Cache the result
    cache.set(cacheKey, { result, timestamp: Date.now() });

    return result;

  } catch (error) {
    console.error('Fact Check API error:', error);
    
    const result: FactCheckResult = {
      available: true,
      claims: [],
      error: error instanceof Error ? error.message : 'Failed to fetch fact checks'
    };

    return result;
  }
}

/**
 * Calculate a score contribution from fact check results
 * Returns 0-100, higher = more likely fake
 */
export function calculateFactCheckScore(result: FactCheckResult): number {
  if (!result.available || result.claims.length === 0) {
    return 50; // Neutral if no data
  }

  const claimsWithRatings = result.claims.filter(c => c.ratingValue !== undefined);
  
  if (claimsWithRatings.length === 0) {
    return 50;
  }

  // Average the rating values
  const avgRating = claimsWithRatings.reduce((sum, c) => sum + (c.ratingValue || 50), 0) / claimsWithRatings.length;
  
  return Math.round(avgRating);
}
