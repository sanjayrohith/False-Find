/**
 * Emotional Analysis Module
 * Detects emotional manipulation and sensationalist language patterns
 */

export interface EmotionalAnalysisResult {
  score: number; // 0-100, higher = more emotional manipulation
  triggers: EmotionalTrigger[];
  dominantEmotion: string | null;
  manipulationLevel: 'low' | 'medium' | 'high';
}

export interface EmotionalTrigger {
  category: string;
  words: string[];
  intensity: number;
}

// Emotional word dictionaries with intensity weights
const EMOTIONAL_WORDS: Record<string, { words: string[]; weight: number }> = {
  fear: {
    words: [
      'dangerous', 'threat', 'terror', 'deadly', 'alarming', 'crisis',
      'catastrophe', 'disaster', 'panic', 'emergency', 'warning', 'risk',
      'fatal', 'lethal', 'hazard', 'peril', 'menace', 'dread', 'horrifying',
      'nightmare', 'devastating', 'apocalypse', 'doom', 'death'
    ],
    weight: 1.2
  },
  anger: {
    words: [
      'outrage', 'scandal', 'corrupt', 'betrayal', 'attack', 'destroy',
      'disgrace', 'shameful', 'villain', 'enemy', 'hate', 'furious',
      'rage', 'infuriating', 'disgusting', 'despicable', 'evil', 'wicked',
      'treacherous', 'backstab', 'traitor', 'liar', 'fraud', 'scam'
    ],
    weight: 1.3
  },
  urgency: {
    words: [
      'breaking', 'urgent', 'now', 'immediately', 'before it\'s too late',
      'act now', 'limited time', 'last chance', 'hurry', 'don\'t wait',
      'time is running out', 'critical', 'must see', 'can\'t miss',
      'right now', 'today only', 'expires soon', 'final warning'
    ],
    weight: 1.1
  },
  sensationalism: {
    words: [
      'shocking', 'unbelievable', 'incredible', 'mind-blowing', 'jaw-dropping',
      'explosive', 'bombshell', 'stunning', 'insane', 'crazy', 'wild',
      'epic', 'massive', 'huge', 'enormous', 'unprecedented', 'historic',
      'revolutionary', 'game-changing', 'earth-shattering', 'miraculous'
    ],
    weight: 1.0
  },
  manipulation: {
    words: [
      'they don\'t want you to know', 'the truth about', 'what they\'re hiding',
      'exposed', 'revealed', 'uncovered', 'secret', 'banned', 'censored',
      'cover-up', 'conspiracy', 'mainstream media won\'t tell you',
      'wake up', 'open your eyes', 'think about it', 'do your research',
      'follow the money', 'connect the dots', 'hidden agenda'
    ],
    weight: 1.5
  },
  clickbait: {
    words: [
      'you won\'t believe', 'what happens next', 'number 5 will shock you',
      'doctors hate', 'one weird trick', 'this changes everything',
      'the reason will surprise you', 'find out why', 'here\'s what',
      'everyone is talking about', 'went viral', 'broke the internet'
    ],
    weight: 1.4
  }
};

/**
 * Analyzes text for emotional manipulation patterns
 */
export function analyzeEmotionalContent(text: string): EmotionalAnalysisResult {
  const lowerText = text.toLowerCase();
  const triggers: EmotionalTrigger[] = [];
  let totalScore = 0;
  let maxIntensity = 0;
  let dominantCategory = '';

  for (const [category, { words, weight }] of Object.entries(EMOTIONAL_WORDS)) {
    const foundWords = words.filter(word => lowerText.includes(word.toLowerCase()));
    
    if (foundWords.length > 0) {
      const intensity = foundWords.length * weight;
      totalScore += intensity * 8; // Scale to 0-100 range
      
      triggers.push({
        category: formatCategory(category),
        words: foundWords,
        intensity: Math.min(100, Math.round(intensity * 20))
      });

      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        dominantCategory = category;
      }
    }
  }

  // Check for excessive punctuation patterns
  const exclamationCount = (text.match(/!+/g) || []).length;
  const questionCount = (text.match(/\?+/g) || []).length;
  const capsWordCount = (text.match(/\b[A-Z]{3,}\b/g) || []).length;

  if (exclamationCount > 2) {
    totalScore += exclamationCount * 5;
    triggers.push({
      category: 'Excessive Punctuation',
      words: [`${exclamationCount} exclamation marks`],
      intensity: Math.min(100, exclamationCount * 15)
    });
  }

  if (capsWordCount > 2) {
    totalScore += capsWordCount * 4;
    triggers.push({
      category: 'Capitalization',
      words: [`${capsWordCount} ALL CAPS words`],
      intensity: Math.min(100, capsWordCount * 12)
    });
  }

  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  // Determine manipulation level
  let manipulationLevel: 'low' | 'medium' | 'high';
  if (normalizedScore < 25) {
    manipulationLevel = 'low';
  } else if (normalizedScore < 55) {
    manipulationLevel = 'medium';
  } else {
    manipulationLevel = 'high';
  }

  return {
    score: normalizedScore,
    triggers,
    dominantEmotion: dominantCategory ? formatCategory(dominantCategory) : null,
    manipulationLevel
  };
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
}
