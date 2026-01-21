import { useState, useEffect } from 'react';
import { analyzeEmotionalContent, EmotionalAnalysisResult } from '@/lib/emotionalAnalysis';
import { analyzeSourceCredibility, SourceCredibilityResult } from '@/lib/sourceCredibility';
import { checkFactsWithGoogle, calculateFactCheckScore, FactCheckResult, isFactCheckApiAvailable } from '@/services/factCheckApi';

export interface AnalysisResult {
  id: string;
  text: string;
  verdict: 'fake' | 'verified' | 'uncertain';
  confidence: number;
  reasons: string[];
  timestamp: Date;
  // New enhanced analysis fields
  emotionalAnalysis?: EmotionalAnalysisResult;
  sourceCredibility?: SourceCredibilityResult;
  factCheckResults?: FactCheckResult;
}

// Re-export types for use in components
export type { EmotionalAnalysisResult, SourceCredibilityResult, FactCheckResult };

const SENSATIONALIST_WORDS = [
  'shocking', 'unbelievable', 'you won\'t believe', 'breaking', 'urgent',
  'exclusive', 'secret', 'banned', 'they don\'t want you to know',
  'miracle', 'cure', 'exposed', 'conspiracy', 'cover-up', 'hoax'
];

const CREDIBILITY_PHRASES = [
  'according to', 'research shows', 'study finds', 'experts say',
  'scientists confirm', 'data indicates', 'evidence suggests'
];

export function useFakeNewsDetector() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('newsCheckHistory');
    if (saved) {
      const parsed = JSON.parse(saved).map((item: AnalysisResult) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setHistory(parsed);
    }
  }, []);

  const saveToHistory = (result: AnalysisResult) => {
    const updated = [result, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('newsCheckHistory', JSON.stringify(updated));
  };

  const analyzeNews = async (text: string) => {
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const lowerText = text.toLowerCase();
    const reasons: string[] = [];
    let heuristicScore = 0;

    // Check for sensationalist language
    const sensationalistFound = SENSATIONALIST_WORDS.filter(word => lowerText.includes(word));
    if (sensationalistFound.length > 0) {
      heuristicScore += sensationalistFound.length * 15;
      reasons.push(`Sensationalist language detected: "${sensationalistFound.slice(0, 2).join('", "')}"`);
    }

    // Check for excessive punctuation
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    if (exclamationCount > 2 || questionCount > 3) {
      heuristicScore += 20;
      reasons.push('Excessive punctuation suggests emotional manipulation');
    }

    // Check for ALL CAPS words
    const capsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
    if (capsWords.length > 1) {
      heuristicScore += 15;
      reasons.push('Multiple ALL CAPS words indicate sensationalism');
    }

    // Check for credibility indicators
    const credibilityFound = CREDIBILITY_PHRASES.some(phrase => lowerText.includes(phrase));
    if (credibilityFound) {
      heuristicScore -= 20;
      reasons.push('Contains source attribution (positive indicator)');
    }

    // Check text length
    if (text.length < 50) {
      heuristicScore += 10;
      reasons.push('Very short content lacks context');
    }

    // Check for URLs
    if (text.includes('http') || text.includes('www')) {
      heuristicScore -= 10;
      reasons.push('Contains external links for verification');
    }

    // Clamp heuristic score
    heuristicScore = Math.max(0, Math.min(100, heuristicScore));

    // === NEW: Emotional Analysis ===
    const emotionalAnalysis = analyzeEmotionalContent(text);
    if (emotionalAnalysis.triggers.length > 0 && emotionalAnalysis.manipulationLevel !== 'low') {
      reasons.push(`Emotional manipulation detected (${emotionalAnalysis.manipulationLevel} level)`);
    }

    // === NEW: Source Credibility Analysis ===
    const sourceCredibility = analyzeSourceCredibility(text);
    sourceCredibility.factors.forEach(factor => {
      if (!reasons.includes(factor)) {
        reasons.push(factor);
      }
    });

    // === NEW: Google Fact Check API (Optional) ===
    let factCheckResults: FactCheckResult | undefined;
    let factCheckScore = 50; // Neutral default
    
    if (isFactCheckApiAvailable()) {
      try {
        factCheckResults = await checkFactsWithGoogle(text);
        if (factCheckResults.claims.length > 0) {
          factCheckScore = calculateFactCheckScore(factCheckResults);
          const topClaim = factCheckResults.claims[0];
          reasons.push(`Related claim fact-checked by ${topClaim.publisher}: "${topClaim.rating}"`);
        }
      } catch (error) {
        console.error('Fact check failed:', error);
      }
    }

    // === Weighted Score Calculation ===
    // Weights: Heuristic 30%, Emotional 30%, Source 40%
    // If fact check available, redistribute: Heuristic 20%, Emotional 20%, Source 30%, FactCheck 30%
    let finalScore: number;
    
    if (factCheckResults && factCheckResults.claims.length > 0) {
      finalScore = (
        heuristicScore * 0.20 +
        emotionalAnalysis.score * 0.20 +
        sourceCredibility.score * 0.30 +
        factCheckScore * 0.30
      );
    } else {
      finalScore = (
        heuristicScore * 0.30 +
        emotionalAnalysis.score * 0.30 +
        sourceCredibility.score * 0.40
      );
    }

    // Add some small randomness for demo purposes
    finalScore += Math.random() * 10 - 5;

    // Clamp final score
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Determine verdict
    let verdict: 'fake' | 'verified' | 'uncertain';
    if (finalScore >= 50) {
      verdict = 'fake';
      if (reasons.length === 0) {
        reasons.push('Multiple indicators suggest unreliable content');
      }
    } else if (finalScore <= 25) {
      verdict = 'verified';
      if (reasons.filter(r => !r.includes('positive')).length === 0) {
        reasons.push('Content appears to follow journalistic standards');
      }
    } else {
      verdict = 'uncertain';
      reasons.push('Unable to determine authenticity with high confidence');
    }

    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      text,
      verdict,
      confidence: verdict === 'uncertain' ? 50 : Math.round(Math.abs(50 - finalScore) * 2),
      reasons,
      timestamp: new Date(),
      // Include enhanced analysis results
      emotionalAnalysis,
      sourceCredibility,
      factCheckResults
    };

    setCurrentResult(result);
    saveToHistory(result);
    setIsAnalyzing(false);

    return result;
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('newsCheckHistory');
  };

  const loadFromHistory = (result: AnalysisResult) => {
    setCurrentResult(result);
  };

  return {
    isAnalyzing,
    currentResult,
    history,
    analyzeNews,
    clearHistory,
    loadFromHistory,
    setCurrentResult
  };
}
