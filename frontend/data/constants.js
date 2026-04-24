/**
 * NEUROWELL - Constants Configuration
 * Centralized constants for the frontend and shared browser scripts.
 */

const SCORE_RANGES = Object.freeze({
  EXCELLENT: Object.freeze({ min: 80, max: 100, label: 'Excellent', color: '#10b981' }),
  GOOD: Object.freeze({ min: 60, max: 79, label: 'Good', color: '#3b82f6' }),
  FAIR: Object.freeze({ min: 40, max: 59, label: 'Fair', color: '#f59e0b' }),
  POOR: Object.freeze({ min: 0, max: 39, label: 'Poor', color: '#ef4444' })
});

const BURNOUT_RISK = Object.freeze({
  LOW: Object.freeze({ min: 0, max: 30, label: 'Low Risk', color: '#10b981' }),
  MODERATE: Object.freeze({ min: 31, max: 60, label: 'Moderate Risk', color: '#f59e0b' }),
  HIGH: Object.freeze({ min: 61, max: 100, label: 'High Risk', color: '#ef4444' })
});

const GOALS = Object.freeze({
  IMPROVE_SLEEP: Object.freeze({
    id: 'improve_sleep',
    name: 'Improve Sleep',
    description: 'Achieve better sleep quality and consistency',
    icon: '😴',
    category: 'Physical',
    targetScore: 75,
    currentThreshold: 'physical',
    baselineThreshold: 60,
    color: '#667eea'
  }),
  REDUCE_STRESS: Object.freeze({
    id: 'reduce_stress',
    name: 'Reduce Stress',
    description: 'Lower stress levels and increase mental resilience',
    icon: '🧘',
    category: 'Mental',
    targetScore: 80,
    currentThreshold: 'mental',
    baselineThreshold: 50,
    color: '#764ba2'
  }),
  INCREASE_ACTIVITY: Object.freeze({
    id: 'increase_activity',
    name: 'Increase Activity',
    description: 'Build better exercise and movement habits',
    icon: '🏃',
    category: 'Physical',
    targetScore: 85,
    currentThreshold: 'physical',
    baselineThreshold: 55,
    color: '#f59e0b'
  })
});

const CONSTANTS = Object.freeze({
  CATEGORIES: Object.freeze({
    PHYSICAL: 'Physical Health',
    MENTAL: 'Mental Health',
    EMOTIONAL: 'Emotional Wellness'
  }),
  SCORE_RANGES,
  BURNOUT_RISK,
  ASSESSMENT: Object.freeze({
    TOTAL_QUESTIONS: 15,
    QUESTIONS_PER_STEP: 3,
    TOTAL_STEPS: 5
  }),
  STORAGE: Object.freeze({
    ASSESSMENT_RESPONSES: 'neurowell_assessment_responses',
    WELLNESS_SCORE: 'neurowell_wellness_score',
    LAST_ASSESSMENT_DATE: 'neurowell_last_assessment_date',
    HISTORICAL_DATA: 'neurowell_historical_data',
    GOALS: 'neurowell_goals'
  }),
  GOALS,
  ANIMATIONS: Object.freeze({
    FADE_IN: 300,
    SLIDE_IN: 400,
    TRANSITION: 200
  })
});

if (typeof window !== 'undefined') {
  window.CONSTANTS = CONSTANTS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONSTANTS;
}
