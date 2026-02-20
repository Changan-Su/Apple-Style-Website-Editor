/**
 * Quiz Engine - Apple-style interactive quiz with single-question display
 * Features: One question at a time, immediate feedback, Next button transition
 */

window.QuizEngine = (function() {
  'use strict';

  const quizzes = new Map();

  function isEditMode() {
    return document.body.classList.contains('edit-mode');
  }

  function init(quizId) {
    const material = window.SectionRenderer ? window.SectionRenderer.getMaterial() : null;
    if (!material) {
      console.warn('Material not available for quiz');
      return;
    }

    const quizData = material.index?.[quizId];
    if (!quizData || !quizData.questions) {
      console.warn(`No quiz data found for ${quizId}`);
      return;
    }

    const section = document.querySelector(`[data-quiz-id="${quizId}"]`);
    if (!section) return;

    const quiz = {
      id: quizId,
      data: quizData,
      section,
      currentQuestionIndex: 0,
      answers: {},
      correctCount: 0
    };

    quizzes.set(quizId, quiz);
    attachEventListeners(quiz);
    showQuestion(quiz, 0);
    
    // Set initial collapsed state
    if (quizData.collapsed !== false) {
      section.classList.add('quiz-collapsed');
      section.classList.remove('quiz-expanded');
    } else {
      section.classList.remove('quiz-collapsed');
      section.classList.add('quiz-expanded');
    }
    
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function initAll() {
    const sections = document.querySelectorAll('.quiz-section[data-quiz-id]');
    sections.forEach(section => {
      const quizId = section.getAttribute('data-quiz-id');
      init(quizId);
    });
  }

  function attachEventListeners(quiz) {
    const { section } = quiz;
    
    // Attach click handlers to all option buttons
    const optionButtons = section.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        handleOptionClick(quiz, this);
      });
    });
    
    // Attach click handlers to all Next buttons
    const nextButtons = section.querySelectorAll('.quiz-next-btn');
    nextButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        handleNextClick(quiz);
      });
    });
  }

  function showQuestion(quiz, questionIndex) {
    const { section } = quiz;
    const questionCards = section.querySelectorAll('.quiz-question-card');
    
    questionCards.forEach((card, idx) => {
      if (idx === questionIndex) {
        // Show current question with fade-in
        card.classList.add('active');
        card.style.animation = 'quiz-fade-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        card.classList.remove('active');
      }
    });
    
    quiz.currentQuestionIndex = questionIndex;
  }

  function handleOptionClick(quiz, button) {
    if (isEditMode()) return;

    const questionIndex = parseInt(button.getAttribute('data-question-index'));
    const optionIndex = parseInt(button.getAttribute('data-option-index'));
    
    // Only handle if this is the current question
    if (questionIndex !== quiz.currentQuestionIndex) {
      return;
    }
    
    // Check if this question was already answered
    if (quiz.answers[questionIndex] !== undefined) {
      return;
    }
    
    // Record the answer
    quiz.answers[questionIndex] = optionIndex;
    
    const question = quiz.data.questions[questionIndex];
    const isCorrect = optionIndex === question.answer;
    
    if (isCorrect) {
      quiz.correctCount++;
      showCorrectFeedback(quiz, questionIndex, button);
    } else {
      showWrongFeedback(quiz, questionIndex, button);
    }
    
    // Show explanation
    showExplanation(quiz, questionIndex);
    
    // Disable all options for this question
    disableQuestionOptions(quiz, questionIndex);
    
    // Show Next button
    showNextButton(quiz, questionIndex);
  }

  function handleNextClick(quiz) {
    if (isEditMode()) return;

    const { currentQuestionIndex, data } = quiz;
    const nextIndex = currentQuestionIndex + 1;
    
    // Hide current question with fade-out
    const currentCard = quiz.section.querySelector(`[data-question-index="${currentQuestionIndex}"]`);
    if (currentCard) {
      currentCard.style.animation = 'quiz-fade-slide-out 0.4s cubic-bezier(0.4, 0.0, 1, 1)';
      
      setTimeout(() => {
        currentCard.classList.remove('active');
        
        // Show next question or results
        if (nextIndex < data.questions.length) {
          showQuestion(quiz, nextIndex);
        } else {
          showScoreSummary(quiz);
        }
      }, 400);
    }
  }

  function showCorrectFeedback(quiz, questionIndex, button) {
    button.classList.add('quiz-option-correct');
    button.classList.remove('border-white/10');
    button.classList.add('border-green-500', 'bg-green-900/20');
    
    const checkmark = button.querySelector('.quiz-option-checkmark');
    if (checkmark) {
      checkmark.classList.remove('opacity-0');
      checkmark.classList.add('opacity-100', 'text-green-500');
      
      const svg = checkmark.querySelector('svg polyline');
      if (svg) {
        svg.style.strokeDasharray = '100';
        svg.style.strokeDashoffset = '100';
        svg.style.animation = 'checkmark-draw 0.6s ease-out forwards';
      }
    }
    
    celebrateCorrectAnswer(button);
    button.style.animation = 'quiz-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  }

  function showWrongFeedback(quiz, questionIndex, button) {
    button.classList.add('quiz-option-wrong');
    button.classList.remove('border-white/10');
    button.classList.add('border-red-500', 'bg-red-900/20');
    button.style.animation = 'quiz-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
    
    const question = quiz.data.questions[questionIndex];
    const questionCard = quiz.section.querySelector(`[data-question-index="${questionIndex}"]`);
    const correctButton = questionCard.querySelector(`[data-option-index="${question.answer}"]`);
    
    if (correctButton) {
      setTimeout(() => {
        correctButton.classList.add('quiz-option-correct-reveal');
        correctButton.classList.remove('border-white/10');
        correctButton.classList.add('border-green-500', 'bg-green-900/20');
        
        const checkmark = correctButton.querySelector('.quiz-option-checkmark');
        if (checkmark) {
          checkmark.classList.remove('opacity-0');
          checkmark.classList.add('opacity-100', 'text-green-500');
        }
      }, 300);
    }
  }

  function celebrateCorrectAnswer(button) {
    const particles = button.querySelector('.quiz-option-particles');
    if (!particles) return;
    
    particles.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'quiz-particle';
      
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: linear-gradient(135deg, #22d3ee, #06b6d4);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: particle-burst 1s ease-out forwards;
        --tx: ${tx}px;
        --ty: ${ty}px;
        opacity: 0;
      `;
      
      particles.appendChild(particle);
    }
    
    setTimeout(() => {
      particles.innerHTML = '';
    }, 1000);
  }

  function showExplanation(quiz, questionIndex) {
    const questionCard = quiz.section.querySelector(`[data-question-index="${questionIndex}"]`);
    const explanationPanel = questionCard.querySelector('.quiz-explanation-panel');
    
    if (explanationPanel) {
      setTimeout(() => {
        explanationPanel.classList.remove('hidden');
        explanationPanel.style.animation = 'quiz-slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }, 400);
    }
  }

  function showNextButton(quiz, questionIndex) {
    const questionCard = quiz.section.querySelector(`[data-question-index="${questionIndex}"]`);
    const nextBtnContainer = questionCard.querySelector('.quiz-next-btn-container');
    
    if (nextBtnContainer) {
      setTimeout(() => {
        nextBtnContainer.classList.remove('hidden');
        nextBtnContainer.style.animation = 'quiz-fade-in 0.4s ease-out';
        
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }, 600);
    }
  }

  function disableQuestionOptions(quiz, questionIndex) {
    const questionCard = quiz.section.querySelector(`[data-question-index="${questionIndex}"]`);
    const optionButtons = questionCard.querySelectorAll('.quiz-option-btn');
    
    optionButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('cursor-not-allowed');
      btn.style.pointerEvents = 'none';
    });
  }

  function showScoreSummary(quiz) {
    const { section, correctCount, data } = quiz;
    const total = data.questions.length;
    
    // Hide all question cards
    const questionCards = section.querySelectorAll('.quiz-question-card');
    questionCards.forEach(card => card.classList.remove('active'));

    // Collapse the questions container so it takes no space
    const questionsContainer = section.querySelector('.quiz-questions-container');
    if (questionsContainer) {
      questionsContainer.style.minHeight = '0';
      questionsContainer.style.height = '0';
      questionsContainer.style.overflow = 'hidden';
    }
    
    const scoreSummary = section.querySelector('.quiz-score-summary');
    const finalScore = section.querySelector('.quiz-final-score');
    
    if (scoreSummary && finalScore) {
      finalScore.textContent = correctCount;
      scoreSummary.classList.remove('hidden');
      scoreSummary.style.animation = 'quiz-slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }

  function toggleCollapse(quizId) {
    const quiz = quizzes.get(quizId);
    if (!quiz) return;
    
    const { section } = quiz;
    const isCollapsed = section.classList.contains('quiz-collapsed');
    
    if (isCollapsed) {
      section.classList.remove('quiz-collapsed');
      section.classList.add('quiz-expanded');
      
      const chevron = section.querySelector('.quiz-chevron');
      if (chevron) {
        chevron.style.transform = 'rotate(180deg)';
      }
    } else {
      section.classList.add('quiz-collapsed');
      section.classList.remove('quiz-expanded');
      
      const chevron = section.querySelector('.quiz-chevron');
      if (chevron) {
        chevron.style.transform = 'rotate(0deg)';
      }
      
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function reset(quizId) {
    const quiz = quizzes.get(quizId);
    if (!quiz) return;
    
    quiz.answers = {};
    quiz.currentQuestionIndex = 0;
    quiz.correctCount = 0;
    
    const { section } = quiz;
    
    const scoreSummary = section.querySelector('.quiz-score-summary');
    if (scoreSummary) {
      scoreSummary.classList.add('hidden');
    }

    // Restore the questions container height
    const questionsContainer = section.querySelector('.quiz-questions-container');
    if (questionsContainer) {
      questionsContainer.style.minHeight = '';
      questionsContainer.style.height = '';
      questionsContainer.style.overflow = '';
    }
    
    const questionCards = section.querySelectorAll('.quiz-question-card');
    questionCards.forEach(card => {
      const explanation = card.querySelector('.quiz-explanation-panel');
      if (explanation) {
        explanation.classList.add('hidden');
      }
      
      const nextBtnContainer = card.querySelector('.quiz-next-btn-container');
      if (nextBtnContainer) {
        nextBtnContainer.classList.add('hidden');
      }
      
      const optionButtons = card.querySelectorAll('.quiz-option-btn');
      optionButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.pointerEvents = 'auto';
        btn.classList.remove(
          'cursor-not-allowed',
          'quiz-option-correct',
          'quiz-option-wrong',
          'quiz-option-correct-reveal',
          'border-green-500',
          'bg-green-900/20',
          'border-red-500',
          'bg-red-900/20'
        );
        btn.classList.add('border-white/10');
        btn.style.animation = '';
        
        const checkmark = btn.querySelector('.quiz-option-checkmark');
        if (checkmark) {
          checkmark.classList.remove('opacity-100', 'text-green-500');
          checkmark.classList.add('opacity-0');
        }
        
        const particles = btn.querySelector('.quiz-option-particles');
        if (particles) {
          particles.innerHTML = '';
        }
      });
    });
    
    showQuestion(quiz, 0);
  }

  return {
    init,
    initAll,
    toggleCollapse,
    reset
  };
})();
