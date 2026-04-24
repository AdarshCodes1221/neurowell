/**
 * NEUROWELL - Assessment Module
 * Handles multi-step assessment form
 * Manages question display, response capture, and progression
 */

const AssessmentManager = {
  currentStep: 1,
  totalSteps: CONSTANTS.ASSESSMENT.TOTAL_STEPS,
  responses: [],

  /**
   * Initialize assessment page
   */
  init: () => {
    console.log('🏥 Initializing Assessment...');

    // Load previous responses if exists
    const saved = StorageManager.getAssessmentResponses();
    if (saved && saved.responses) {
      AssessmentManager.responses = saved.responses;
    }

    // Render initial UI
    AssessmentManager.renderAssessment();

    // Set up event listeners
    AssessmentManager.setupEventListeners();

    console.log('✅ Assessment Ready');
  },

  /**
   * Render assessment UI
   */
  renderAssessment: () => {
    const container = document.getElementById('assessmentContainer');
    if (!container) return;

    // Render step indicator
    AssessmentManager.renderStepIndicator();

    // Render questions for current step
    AssessmentManager.renderQuestions();

    // Render navigation buttons
    AssessmentManager.renderNavigation();
  },

  /**
   * Render step indicator
   */
  renderStepIndicator: () => {
    const indicator = document.getElementById('stepIndicator');
    if (!indicator) return;

    let html = '<div class="step-indicator">';

    for (let i = 1; i <= AssessmentManager.totalSteps; i++) {
      const isActive = i === AssessmentManager.currentStep;
      const isCompleted = i < AssessmentManager.currentStep;
      let classNames = 'step';

      if (isActive) classNames += ' active';
      if (isCompleted) classNames += ' completed';

      html += `
        <div class="${classNames}">
          <div class="step-number">${isCompleted ? '✓' : i}</div>
          <div class="step-label">Step ${i}</div>
        </div>
      `;
    }

    html += '</div>';
    indicator.innerHTML = html;
  },

  /**
   * Render questions for current step
   */
  renderQuestions: () => {
    const container = document.getElementById('questionsContainer');
    if (!container) return;

    const questions = QUESTIONS.filter(q => q.step === AssessmentManager.currentStep);
    let html = '';

    questions.forEach((question) => {
      const response = AssessmentManager.responses.find(r => r.question_id === question.id);
      const selectedValue = response ? response.value : 0;
      const selectedOption = selectedValue > 0 ? question.options[selectedValue - 1] : null;
      const selectedLabel = selectedOption ? selectedOption.label : 'Not answered';
      const minLabel = question.options[0]?.label || '';
      const maxLabel = question.options[question.options.length - 1]?.label || '';
      const maxValue = question.options.length;

      html += `
        <div class="question-card" data-animate>
          <div class="question-number">Question ${question.id} of ${CONSTANTS.ASSESSMENT.TOTAL_QUESTIONS}</div>
          <span class="question-category">${question.category}</span>
          <p class="question-text">${question.question}</p>

          <div class="scale-container">
            <input 
              type="range" 
              class="scale-slider" 
              min="1" 
              max="${maxValue}" 
              value="${selectedValue}"
              data-question-id="${question.id}"
              data-question-impact="${question.impact}"
            />
            <div class="scale-labels">
              <span>${minLabel}</span>
              <span>${maxLabel}</span>
            </div>
            <div class="scale-value">
              <span>Selected: ${selectedValue > 0 ? selectedLabel : 'Not answered'}</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach slider listeners
    container.querySelectorAll('.scale-slider').forEach(slider => {
      slider.addEventListener('input', AssessmentManager.onResponseChange);
    });
  },

  /**
   * Render navigation buttons
   */
  renderNavigation: () => {
    const container = document.getElementById('navigationContainer');
    if (!container) return;

    let html = '<div class="button-group">';

    // Previous button
    if (AssessmentManager.currentStep > 1) {
      html += `
        <button class="btn btn-secondary" id="prevBtn">
          ← Previous
        </button>
      `;
    }

    // Next or Submit button
    if (AssessmentManager.currentStep < AssessmentManager.totalSteps) {
      html += `
        <button class="btn btn-primary" id="nextBtn">
          Next →
        </button>
      `;
    } else {
      html += `
        <button class="btn btn-success" id="submitBtn" style="flex: 1;">
          Submit Assessment ✓
        </button>
      `;
    }

    html += '</div>';
    container.innerHTML = html;

    // Attach button listeners
    if (document.getElementById('prevBtn')) {
      document.getElementById('prevBtn').addEventListener('click', AssessmentManager.previousStep);
    }
    if (document.getElementById('nextBtn')) {
      document.getElementById('nextBtn').addEventListener('click', AssessmentManager.nextStep);
    }
    if (document.getElementById('submitBtn')) {
      document.getElementById('submitBtn').addEventListener('click', AssessmentManager.submitAssessment);
    }
  },

  /**
   * Handle response change
   */
  onResponseChange: (e) => {
    const slider = e.target;
    const questionId = parseInt(slider.dataset.questionId);
    const value = parseInt(slider.value);
    const question = QUESTIONS.find(q => q.id === questionId);
    const selectedOption = question?.options?.[value - 1] || null;
    const selectedLabel = selectedOption ? selectedOption.label : value;

    // Update responses array
    const existingIndex = AssessmentManager.responses.findIndex(r => r.question_id === questionId);
    if (existingIndex >= 0) {
      AssessmentManager.responses[existingIndex].value = value;
    } else {
      AssessmentManager.responses.push({ question_id: questionId, value: value });
    }

    // Update display
    const valueDisplay = slider.parentElement.querySelector('.scale-value span');
    if (valueDisplay) {
      valueDisplay.textContent = `Selected: ${selectedLabel}`;
    }

    // Save to storage
    StorageManager.saveAssessmentResponses(AssessmentManager.responses);

    console.log(`📝 Question ${questionId} answered: ${value} (${selectedLabel})`);
  },

  /**
   * Validate current step
   */
  validateStep: () => {
    const questions = QUESTIONS.filter(q => q.step === AssessmentManager.currentStep);
    
    for (const question of questions) {
      const response = AssessmentManager.responses.find(r => r.question_id === question.id);
      if (!response || response.value === 0) {
        AppManager.showNotification('⚠️ Please answer all questions on this step', 'warning');
        return false;
      }
    }

    return true;
  },

  /**
   * Move to next step
   */
  nextStep: () => {
    if (!AssessmentManager.validateStep()) return;

    if (AssessmentManager.currentStep < AssessmentManager.totalSteps) {
      AssessmentManager.currentStep++;
      AssessmentManager.renderAssessment();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(`📍 Moved to step ${AssessmentManager.currentStep}`);
    }
  },

  /**
   * Move to previous step
   */
  previousStep: () => {
    if (AssessmentManager.currentStep > 1) {
      AssessmentManager.currentStep--;
      AssessmentManager.renderAssessment();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(`📍 Moved to step ${AssessmentManager.currentStep}`);
    }
  },

  /**
   * Submit assessment
   */
  submitAssessment: () => {
    if (!AssessmentManager.validateStep()) return;

    // Prevent double submission
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = true;

    AppManager.showLoader('Analyzing Your Responses', 'Calculating wellness scores...');

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Calculate scores
        const scores = ScoringEngine.calculateScores(AssessmentManager.responses);
        
        // Save scores and date
        StorageManager.saveWellnessScore(scores);
        StorageManager.saveLastAssessmentDate();
        StorageManager.saveHistoricalData(scores);

        AppManager.hideLoader();
        AppManager.showNotification('✅ Assessment completed successfully!', 'success');

        console.log('🎉 Assessment submitted', scores);

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);

      } catch (error) {
        AppManager.hideLoader();
        AppManager.showNotification('❌ Error processing assessment: ' + error.message, 'error');
        console.error('Assessment error:', error);
        
        if (submitBtn) submitBtn.disabled = false;
      }
    }, 1500);
  },

  /**
   * Set up event listeners
   */
  setupEventListeners: () => {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
        if (submitBtn && !submitBtn.disabled) submitBtn.click();
      }
    });

    // Save assessment on page unload
    window.addEventListener('beforeunload', () => {
      if (AssessmentManager.responses.length > 0) {
        StorageManager.saveAssessmentResponses(AssessmentManager.responses);
      }
    });
  },

  /**
   * Get assessment progress
   */
  getProgress: () => {
    const progress = StorageManager.getAssessmentProgress();
    return {
      step: AssessmentManager.currentStep,
      totalSteps: AssessmentManager.totalSteps,
      answered: progress.completed,
      total: progress.total,
      percentage: progress.percentage
    };
  }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', AssessmentManager.init);
