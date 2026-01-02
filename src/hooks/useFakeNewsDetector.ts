import { useState, useEffect } from 'react';

export interface AnalysisResult {
  id: string;
  text: string;
  verdict: 'fake' | 'verified' | 'uncertain';
  confidence: number;
  reasons: string[];
  timestamp: Date;
}

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
    let fakeScore = 0;

    // Check for sensationalist language
    const sensationalistFound = SENSATIONALIST_WORDS.filter(word => lowerText.includes(word));
    if (sensationalistFound.length > 0) {
      fakeScore += sensationalistFound.length * 15;
      reasons.push(`Sensationalist language detected: "${sensationalistFound.slice(0, 2).join('", "')}"`);
    }

    // Check for excessive punctuation
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    if (exclamationCount > 2 || questionCount > 3) {
      fakeScore += 20;
      reasons.push('Excessive punctuation suggests emotional manipulation');
    }

    // Check for ALL CAPS words
    const capsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
    if (capsWords.length > 1) {
      fakeScore += 15;
      reasons.push('Multiple ALL CAPS words indicate sensationalism');
    }

    // Check for credibility indicators
    const credibilityFound = CREDIBILITY_PHRASES.some(phrase => lowerText.includes(phrase));
    if (credibilityFound) {
      fakeScore -= 20;
      reasons.push('Contains source attribution (positive indicator)');
    }

    // Check text length
    if (text.length < 50) {
      fakeScore += 10;
      reasons.push('Very short content lacks context');
    }

    // Check for URLs
    if (text.includes('http') || text.includes('www')) {
      fakeScore -= 10;
      reasons.push('Contains external links for verification');
    }

    // Add some randomness for demo purposes
    fakeScore += Math.random() * 20 - 10;

    // Clamp score
    fakeScore = Math.max(0, Math.min(100, fakeScore));

    // Determine verdict
    let verdict: 'fake' | 'verified' | 'uncertain';
    if (fakeScore >= 50) {
      verdict = 'fake';
      if (reasons.length === 0) {
        reasons.push('Multiple indicators suggest unreliable content');
      }
    } else if (fakeScore <= 25) {
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
      confidence: verdict === 'uncertain' ? 50 : Math.round(Math.abs(50 - fakeScore) * 2),
      reasons,
      timestamp: new Date()
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
