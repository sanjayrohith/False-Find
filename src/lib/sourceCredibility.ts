/**
 * Source Credibility Module
 * Checks URLs and domain references for credibility indicators
 */

export interface SourceCredibilityResult {
  score: number; // 0-100, higher = less credible (more fake indicators)
  foundSources: SourceInfo[];
  overallReputation: 'trusted' | 'mixed' | 'untrusted' | 'unknown';
  factors: string[];
}

export interface SourceInfo {
  domain: string;
  reputation: 'trusted' | 'satire' | 'unreliable' | 'mixed' | 'unknown';
  category?: string;
}

// Trusted mainstream and fact-checking sources
const TRUSTED_SOURCES: Record<string, string> = {
  'reuters.com': 'Major Wire Service',
  'apnews.com': 'Major Wire Service',
  'bbc.com': 'Public Broadcaster',
  'bbc.co.uk': 'Public Broadcaster',
  'npr.org': 'Public Broadcaster',
  'pbs.org': 'Public Broadcaster',
  'nytimes.com': 'Major Newspaper',
  'washingtonpost.com': 'Major Newspaper',
  'wsj.com': 'Major Newspaper',
  'theguardian.com': 'Major Newspaper',
  'economist.com': 'Major Publication',
  'nature.com': 'Scientific Journal',
  'science.org': 'Scientific Journal',
  'sciencedirect.com': 'Scientific Database',
  'pubmed.gov': 'Medical Database',
  'cdc.gov': 'Government Health Agency',
  'who.int': 'International Health Organization',
  'factcheck.org': 'Fact-Checking Organization',
  'snopes.com': 'Fact-Checking Organization',
  'politifact.com': 'Fact-Checking Organization',
  'fullfact.org': 'Fact-Checking Organization',
  'gov.uk': 'Government Source',
  'usa.gov': 'Government Source',
  'edu': 'Educational Institution',
};

// Known satire sites (not necessarily bad, but not real news)
const SATIRE_SOURCES: Record<string, string> = {
  'theonion.com': 'Satire',
  'babylonbee.com': 'Satire',
  'clickhole.com': 'Satire',
  'thebeaverton.com': 'Satire',
  'waterfordwhispersnews.com': 'Satire',
  'newsthump.com': 'Satire',
  'thedailymash.co.uk': 'Satire',
};

// Known unreliable or heavily biased sources
const UNRELIABLE_SOURCES: Record<string, string> = {
  'infowars.com': 'Conspiracy/Misinformation',
  'naturalnews.com': 'Health Misinformation',
  'worldnewsdailyreport.com': 'Fake News',
  'beforeitsnews.com': 'Conspiracy/Misinformation',
  'yournewswire.com': 'Fake News',
  'newspunch.com': 'Fake News',
  'collective-evolution.com': 'Pseudoscience',
};

// Suspicious domain patterns
const SUSPICIOUS_PATTERNS = [
  /news\d+\.com$/i,
  /daily.*news.*\d/i,
  /truth.*news/i,
  /real.*news.*\d/i,
  /-news\.com$/i,
  /breaking.*\d/i,
];

/**
 * Extract domains from text (URLs and mentions)
 */
function extractDomains(text: string): string[] {
  const domains: string[] = [];
  
  // Match full URLs
  const urlRegex = /https?:\/\/(?:www\.)?([a-zA-Z0-9][-a-zA-Z0-9]*(?:\.[a-zA-Z0-9][-a-zA-Z0-9]*)+)/gi;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    domains.push(match[1].toLowerCase());
  }

  // Match www. domains without protocol
  const wwwRegex = /www\.([a-zA-Z0-9][-a-zA-Z0-9]*(?:\.[a-zA-Z0-9][-a-zA-Z0-9]*)+)/gi;
  while ((match = wwwRegex.exec(text)) !== null) {
    const domain = match[1].toLowerCase();
    if (!domains.includes(domain)) {
      domains.push(domain);
    }
  }

  // Match domain mentions (e.g., "according to bbc.com")
  const mentionRegex = /(?:from|via|source:|according to|reported by)\s+([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,})/gi;
  while ((match = mentionRegex.exec(text)) !== null) {
    const domain = match[1].toLowerCase();
    if (!domains.includes(domain)) {
      domains.push(domain);
    }
  }

  return domains;
}

/**
 * Check a single domain's reputation
 */
function checkDomainReputation(domain: string): SourceInfo {
  // Check exact matches first
  if (TRUSTED_SOURCES[domain]) {
    return { domain, reputation: 'trusted', category: TRUSTED_SOURCES[domain] };
  }
  if (SATIRE_SOURCES[domain]) {
    return { domain, reputation: 'satire', category: SATIRE_SOURCES[domain] };
  }
  if (UNRELIABLE_SOURCES[domain]) {
    return { domain, reputation: 'unreliable', category: UNRELIABLE_SOURCES[domain] };
  }

  // Check if it's an .edu or .gov domain
  if (domain.endsWith('.edu')) {
    return { domain, reputation: 'trusted', category: 'Educational Institution' };
  }
  if (domain.endsWith('.gov') || domain.endsWith('.gov.uk') || domain.endsWith('.gov.au')) {
    return { domain, reputation: 'trusted', category: 'Government Source' };
  }

  // Check for trusted source subdomains
  for (const trustedDomain of Object.keys(TRUSTED_SOURCES)) {
    if (domain.endsWith('.' + trustedDomain) || domain === trustedDomain) {
      return { domain, reputation: 'trusted', category: TRUSTED_SOURCES[trustedDomain] };
    }
  }

  // Check suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(domain)) {
      return { domain, reputation: 'mixed', category: 'Suspicious Domain Pattern' };
    }
  }

  return { domain, reputation: 'unknown', category: 'Unknown Source' };
}

/**
 * Analyzes text for source credibility
 */
export function analyzeSourceCredibility(text: string): SourceCredibilityResult {
  const domains = extractDomains(text);
  const foundSources: SourceInfo[] = domains.map(checkDomainReputation);
  const factors: string[] = [];
  
  let score = 50; // Start neutral

  // Count by reputation
  const trusted = foundSources.filter(s => s.reputation === 'trusted');
  const satire = foundSources.filter(s => s.reputation === 'satire');
  const unreliable = foundSources.filter(s => s.reputation === 'unreliable');
  const mixed = foundSources.filter(s => s.reputation === 'mixed');

  // Adjust score based on sources found
  if (trusted.length > 0) {
    score -= trusted.length * 20;
    factors.push(`References ${trusted.length} trusted source(s): ${trusted.map(s => s.domain).join(', ')}`);
  }

  if (satire.length > 0) {
    score += satire.length * 30;
    factors.push(`Contains satire source(s): ${satire.map(s => s.domain).join(', ')}`);
  }

  if (unreliable.length > 0) {
    score += unreliable.length * 40;
    factors.push(`Contains known unreliable source(s): ${unreliable.map(s => s.domain).join(', ')}`);
  }

  if (mixed.length > 0) {
    score += mixed.length * 15;
    factors.push(`Contains suspicious domain pattern(s): ${mixed.map(s => s.domain).join(', ')}`);
  }

  // If no sources at all
  if (foundSources.length === 0) {
    factors.push('No external sources or links detected');
    // Slight penalty for no sources
    score += 10;
  }

  // Check for source attribution language without actual sources
  const attributionPatterns = /according to|sources say|reports indicate|experts claim/i;
  if (attributionPatterns.test(text) && trusted.length === 0) {
    score += 15;
    factors.push('Contains attribution language but no verifiable sources');
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine overall reputation
  let overallReputation: 'trusted' | 'mixed' | 'untrusted' | 'unknown';
  if (unreliable.length > 0 || score >= 70) {
    overallReputation = 'untrusted';
  } else if (trusted.length > 0 && unreliable.length === 0 && score < 30) {
    overallReputation = 'trusted';
  } else if (foundSources.length === 0) {
    overallReputation = 'unknown';
  } else {
    overallReputation = 'mixed';
  }

  return {
    score,
    foundSources,
    overallReputation,
    factors
  };
}
