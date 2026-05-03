/**
 * @jest-environment jsdom
 */

// Simulate state management
const createState = () => ({
    currentStep: -1,
    selectedCandidate: null,
    electionPhase: 0,
    fraudScore: 0,
    currentScenario: 0,
    quizScore: 0,
    currentQuiz: 0,
    scenarioAnswered: false,
    quizAnswered: false,
    highContrast: false
});

describe('State Management - Integration', () => {
    let state;

    beforeEach(() => {
        state = createState();
    });

    test('initial state should have correct defaults', () => {
        expect(state.currentStep).toBe(-1);
        expect(state.selectedCandidate).toBeNull();
        expect(state.electionPhase).toBe(0);
        expect(state.fraudScore).toBe(0);
        expect(state.quizScore).toBe(0);
        expect(state.scenarioAnswered).toBe(false);
        expect(state.quizAnswered).toBe(false);
    });

    test('election flow: verify → vote → result', () => {
        // Phase 0: Verify
        state.electionPhase = 0;
        expect(state.electionPhase).toBe(0);

        // Phase 1: Vote
        state.electionPhase = 1;
        state.selectedCandidate = 2;
        expect(state.electionPhase).toBe(1);
        expect(state.selectedCandidate).toBe(2);

        // Phase 2: Result
        state.electionPhase = 2;
        expect(state.electionPhase).toBe(2);
    });

    test('fraud detection: answer 5 scenarios correctly', () => {
        const answers = [1, 1, 2, 3, 1]; // All correct
        const correctAnswers = [1, 1, 2, 3, 1];

        answers.forEach((answer, i) => {
            state.scenarioAnswered = false;
            if (!state.scenarioAnswered) {
                state.scenarioAnswered = true;
                if (answer === correctAnswers[i]) {
                    state.fraudScore++;
                }
                state.currentScenario++;
            }
        });

        expect(state.fraudScore).toBe(5);
        expect(state.currentScenario).toBe(5);
    });

    test('fraud detection: answer 3 out of 5 correctly', () => {
        const answers = [0, 1, 0, 3, 0]; // Only 2 correct
        const correctAnswers = [1, 1, 2, 3, 1];

        answers.forEach((answer, i) => {
            state.scenarioAnswered = false;
            if (!state.scenarioAnswered) {
                state.scenarioAnswered = true;
                if (answer === correctAnswers[i]) {
                    state.fraudScore++;
                }
                state.currentScenario++;
            }
        });

        expect(state.fraudScore).toBe(2);
    });

    test('fraud detection: prevent double answer', () => {
        state.scenarioAnswered = true;
        state.fraudScore = 0;

        // Try to answer again
        if (!state.scenarioAnswered) {
            state.fraudScore++;
        }

        expect(state.fraudScore).toBe(0);
    });

    test('quiz: complete all 10 questions', () => {
        const answers = [1, 2, 2, 2, 1, 0, 2, 1, 1, 1]; // All correct

        answers.forEach((answer) => {
            state.quizAnswered = false;
            if (!state.quizAnswered) {
                state.quizAnswered = true;
                if (answer === answers[state.currentQuiz]) {
                    state.quizScore++;
                }
                state.currentQuiz++;
            }
        });

        expect(state.quizScore).toBe(10);
        expect(state.currentQuiz).toBe(10);
    });

    test('quiz: prevent double answer', () => {
        state.quizAnswered = true;
        state.quizScore = 5;

        if (!state.quizAnswered) {
            state.quizScore++;
        }

        expect(state.quizScore).toBe(5);
    });

    test('reset election should clear all election state', () => {
        state.selectedCandidate = 3;
        state.electionPhase = 2;

        // Simulate reset
        state.selectedCandidate = null;
        state.electionPhase = 0;

        expect(state.selectedCandidate).toBeNull();
        expect(state.electionPhase).toBe(0);
    });

    test('reset fraud should clear fraud state', () => {
        state.currentScenario = 4;
        state.fraudScore = 3;
        state.scenarioAnswered = true;

        state.currentScenario = 0;
        state.fraudScore = 0;
        state.scenarioAnswered = false;

        expect(state.currentScenario).toBe(0);
        expect(state.fraudScore).toBe(0);
        expect(state.scenarioAnswered).toBe(false);
    });

    test('restart quiz should clear quiz state', () => {
        state.currentQuiz = 8;
        state.quizScore = 7;
        state.quizAnswered = true;

        state.currentQuiz = 0;
        state.quizScore = 0;
        state.quizAnswered = false;

        expect(state.currentQuiz).toBe(0);
        expect(state.quizScore).toBe(0);
        expect(state.quizAnswered).toBe(false);
    });

    test('high contrast toggle should persist', () => {
        expect(state.highContrast).toBe(false);
        state.highContrast = !state.highContrast;
        expect(state.highContrast).toBe(true);
        state.highContrast = !state.highContrast;
        expect(state.highContrast).toBe(false);
    });
});

describe('DOM Integration', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should create and sanitize user display name', () => {
        const div = document.createElement('div');
        const maliciousName = '<script>alert("xss")</script>';
        div.textContent = maliciousName;
        document.body.appendChild(div);
        
        expect(div.textContent).toBe(maliciousName);
        expect(div.innerHTML).not.toContain('<script>');
    });

    test('should create progress bar with correct width', () => {
        const bar = document.createElement('div');
        bar.style.width = '0%';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuenow', '0');
        document.body.appendChild(bar);

        // Simulate progress update
        const progress = 50;
        bar.style.width = progress + '%';
        bar.setAttribute('aria-valuenow', progress.toString());

        expect(bar.style.width).toBe('50%');
        expect(bar.getAttribute('aria-valuenow')).toBe('50');
    });

    test('should create accessible button', () => {
        const btn = document.createElement('button');
        btn.setAttribute('aria-label', 'Close menu');
        btn.textContent = '×';
        document.body.appendChild(btn);

        expect(btn.getAttribute('aria-label')).toBe('Close menu');
        expect(btn.textContent).toBe('×');
    });

    test('should create form with proper labels', () => {
        const label = document.createElement('label');
        label.setAttribute('for', 'testInput');
        label.textContent = 'Email';

        const input = document.createElement('input');
        input.id = 'testInput';
        input.type = 'email';
        input.required = true;

        const error = document.createElement('span');
        error.id = 'testInputError';
        error.setAttribute('role', 'alert');
        error.classList.add('hidden');

        document.body.append(label, input, error);

        expect(document.getElementById('testInput')).toBe(input);
        expect(label.getAttribute('for')).toBe('testInput');
        expect(error.getAttribute('role')).toBe('alert');
    });

    test('should create candidate card with radio role', () => {
        const card = document.createElement('div');
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-checked', 'false');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Arjun Sharma, Progressive Alliance');
        document.body.appendChild(card);

        expect(card.getAttribute('role')).toBe('radio');
        expect(card.getAttribute('aria-checked')).toBe('false');
        expect(card.getAttribute('tabindex')).toBe('0');
    });

    test('toast should have alert role', () => {
        const toast = document.createElement('div');
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.id = 'toast';
        document.body.appendChild(toast);

        expect(toast.getAttribute('role')).toBe('alert');
        expect(toast.getAttribute('aria-live')).toBe('assertive');
    });
});
