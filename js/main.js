// User data storage
let users = JSON.parse(localStorage.getItem('quizUsers')) || [];
let currentUser = null;
let currentTopic = null;
let quizQuestions = [];
let currentQuestionIndex = 0;
let selectedOption = null;
let quizStartTime = 0;
let quizTimer = null;
let timeSpent = 0;
let userAnswers = [];

// Sample quiz data - in a real app, this would come from a database
const quizData = {
    math: [
        {
            question: "What is the value of π (pi) to two decimal places?",
            options: ["3.14", "3.16", "3.12", "3.18"],
            correctAnswer: 0
        },
        {
            question: "What is the square root of 144?",
            options: ["14", "12", "10", "16"],
            correctAnswer: 1
        },
        {
            question: "If x + y = 10 and x - y = 4, what is the value of x?",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2
        },
        {
            question: "What is 25% of 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: 1
        },
        {
            question: "What is the area of a rectangle with length 8 units and width 5 units?",
            options: ["35 square units", "40 square units", "45 square units", "50 square units"],
            correctAnswer: 1
        }
    ],
    science: [
        {
            question: "Which of the following is NOT a state of matter?",
            options: ["Solid", "Liquid", "Gas", "Energy"],
            correctAnswer: 3
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Gd", "Au", "Ag", "Go"],
            correctAnswer: 1
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Jupiter", "Mars", "Saturn"],
            correctAnswer: 2
        },
        {
            question: "What is the basic unit of life?",
            options: ["Atom", "Cell", "Molecule", "Tissue"],
            correctAnswer: 1
        },
        {
            question: "What force keeps planets in orbit around the sun?",
            options: ["Magnetic force", "Nuclear force", "Electrostatic force", "Gravitational force"],
            correctAnswer: 3
        }
    ],
    history: [
        {
            question: "In which year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correctAnswer: 2
        },
        {
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
            correctAnswer: 2
        },
        {
            question: "Which ancient civilization built the pyramids at Giza?",
            options: ["Mesopotamians", "Greeks", "Romans", "Egyptians"],
            correctAnswer: 3
        },
        {
            question: "The Renaissance period originated in which country?",
            options: ["France", "Italy", "England", "Spain"],
            correctAnswer: 1
        },
        {
            question: "Which event marked the beginning of World War I?",
            options: ["Assassination of Archduke Franz Ferdinand", "German invasion of Poland", "Treaty of Versailles", "Russian Revolution"],
            correctAnswer: 0
        }
    ]
};

// DOM elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const topicsSection = document.getElementById('topics-section');
const quizSection = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const reviewSection = document.getElementById('review-section');

// Login elements
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerLink = document.getElementById('register-link');

// Register elements
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const registerBtn = document.getElementById('register-btn');
const loginLink = document.getElementById('login-link');

// Topic elements
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');
const topicCards = document.querySelectorAll('.topic-card');

// Quiz elements
const topicTitle = document.getElementById('topic-title');
const questionCounter = document.getElementById('question-counter');
const timer = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const optionsContainer = document.querySelector('.options-container');
const options = document.querySelectorAll('.option');
const nextBtn = document.getElementById('next-btn');
const quitQuizBtn = document.getElementById('quit-quiz');

// Results elements
const scorePercentage = document.getElementById('score-percentage');
const correctAnswers = document.getElementById('correct-answers');
const totalQuestions = document.getElementById('total-questions');
const timeSpentElement = document.getElementById('time-spent');
const reviewBtn = document.getElementById('review-btn');
const returnTopicsBtn = document.getElementById('return-topics');

// Review elements
const reviewContainer = document.getElementById('review-container');
const backToResultsBtn = document.getElementById('back-to-results');

// Event listeners
registerLink.addEventListener('click', showRegisterSection);
loginLink.addEventListener('click', showLoginSection);
loginBtn.addEventListener('click', handleLogin);
registerBtn.addEventListener('click', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

topicCards.forEach(card => {
    card.addEventListener('click', () => {
        startQuiz(card.dataset.topic);
    });
});

nextBtn.addEventListener('click', handleNextQuestion);
quitQuizBtn.addEventListener('click', quitQuiz);
options.forEach(option => {
    option.addEventListener('click', () => {
        selectOption(option);
    });
});

reviewBtn.addEventListener('click', showReviewSection);
returnTopicsBtn.addEventListener('click', returnToTopics);
backToResultsBtn.addEventListener('click', showResultsSection);

// Functions
function showLoginSection() {
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    clearInputs();
}

function showRegisterSection() {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
    clearInputs();
}

function showTopicsSection() {
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    quizSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    reviewSection.classList.add('hidden');
    topicsSection.classList.remove('hidden');
    updateUserDisplay();
    updateProgress();
}

function clearInputs() {
    usernameInput.value = '';
    passwordInput.value = '';
    newUsernameInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
}

function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        showTopicsSection();
    } else {
        alert('Invalid username or password');
    }
}

function handleRegister() {
    const username = newUsernameInput.value.trim();
    const password = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!username || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const userExists = users.some(u => u.username === username);
    
    if (userExists) {
        alert('Username already exists');
        return;
    }

    const newUser = {
        username,
        password,
        progress: {
            math: 0,
            science: 0,
            history: 0
        }
    };

    users.push(newUser);
    localStorage.setItem('quizUsers', JSON.stringify(users));
    
    currentUser = newUser;
    showTopicsSection();
}

function handleLogout() {
    currentUser = null;
    showLoginSection();
}

function updateUserDisplay() {
    userDisplay.textContent = `Welcome, ${currentUser.username}!`;
}

function updateProgress() {
    for (const topic in currentUser.progress) {
        const progressBar = document.getElementById(`${topic}-progress`);
        if (progressBar) {
            progressBar.style.width = `${currentUser.progress[topic]}%`;
        }
    }
}

function startQuiz(topic) {
    currentTopic = topic;
    quizQuestions = [...quizData[topic]]; // Make a copy
    
    // Shuffle the questions
    for (let i = quizQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
    }
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    topicsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    
    topicTitle.textContent = `${topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz`;
    loadQuestion();
    
    // Start timer
    quizStartTime = Date.now();
    timeSpent = 0;
    updateTimer();
    quizTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = Date.now();
    timeSpent = Math.floor((currentTime - quizStartTime) / 1000);
    
    const minutes = Math.floor(timeSpent / 60).toString().padStart(2, '0');
    const seconds = (timeSpent % 60).toString().padStart(2, '0');
    
    timer.textContent = `${minutes}:${seconds}`;
}

function loadQuestion() {
    resetOptionState();
    selectedOption = null;
    nextBtn.disabled = true;
    
    const question = quizQuestions[currentQuestionIndex];
    questionText.textContent = question.question;
    
    options.forEach((option, index) => {
        option.querySelector('.option-text').textContent = question.options[index];
        option.dataset.index = index;
    });
    
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
}

function resetOptionState() {
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
}

function selectOption(option) {
    // If an answer is already submitted, don't allow changes
    if (option.classList.contains('correct') || option.classList.contains('incorrect')) {
        return;
    }
    
    // Reset previously selected option
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Set this option as selected
    option.classList.add('selected');
    selectedOption = parseInt(option.dataset.index);
    nextBtn.disabled = false;
}

function handleNextQuestion() {
    // Record user's answer
    userAnswers.push({
        question: quizQuestions[currentQuestionIndex].question,
        userAnswer: selectedOption,
        correctAnswer: quizQuestions[currentQuestionIndex].correctAnswer
    });
    
    // Move to next question
    currentQuestionIndex++;
    
    // If quiz is complete, show results
    if (currentQuestionIndex >= quizQuestions.length) {
        clearInterval(quizTimer);
        showResults();
    } else {
        loadQuestion();
    }
}

function quitQuiz() {
    clearInterval(quizTimer);
    showTopicsSection();
}

function showResults() {
    quizSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    // Calculate score
    const correctCount = userAnswers.filter(answer => 
        answer.userAnswer === answer.correctAnswer
    ).length;
    
    const percentage = Math.round((correctCount / quizQuestions.length) * 100);
    
    // Update progress for the user
    currentUser.progress[currentTopic] = Math.max(currentUser.progress[currentTopic], percentage);
    localStorage.setItem('quizUsers', JSON.stringify(users));
    
    // Display results
    scorePercentage.textContent = `${percentage}%`;
    correctAnswers.textContent = correctCount;
    totalQuestions.textContent = quizQuestions.length;
    
    // Format time
    const minutes = Math.floor(timeSpent / 60).toString().padStart(2, '0');
    const seconds = (timeSpent % 60).toString().padStart(2, '0');
    timeSpentElement.textContent = `${minutes}:${seconds}`;
}

function showReviewSection() {
    resultsSection.classList.add('hidden');
    reviewSection.classList.remove('hidden');
    
    // Clear previous reviews
    reviewContainer.innerHTML = '';
    
    // Add review items
    userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        // Question
        const questionElem = document.createElement('div');
        questionElem.className = 'review-question';
        questionElem.textContent = `${index + 1}. ${answer.question}`;
        reviewItem.appendChild(questionElem);
        
        // Find the original question data to get all options
        const questionData = quizQuestions.find(q => q.question === answer.question);
        
        // Show all options
        questionData.options.forEach((optionText, optIndex) => {
            const optionElem = document.createElement('div');
            optionElem.className = 'review-option';
            
            // Mark if correct
            if (optIndex === answer.correctAnswer) {
                optionElem.classList.add('correct');
            }
            
            // Mark if user selected this option and it was incorrect
            if (optIndex === answer.userAnswer && optIndex !== answer.correctAnswer) {
                optionElem.classList.add('incorrect', 'user-selected');
            }
            
            // Mark if user selected this option and it was correct
            if (optIndex === answer.userAnswer && optIndex === answer.correctAnswer) {
                optionElem.classList.add('user-selected');
            }
            
            optionElem.textContent = `${String.fromCharCode(65 + optIndex)}. ${optionText}`;
            reviewItem.appendChild(optionElem);
        });
        
        reviewContainer.appendChild(reviewItem);
    });
}

function showResultsSection() {
    reviewSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

function returnToTopics() {
    showTopicsSection();
}

// Initialize the app
showLoginSection();