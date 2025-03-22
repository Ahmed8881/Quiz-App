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
// Dashboard functionality for QuizMaster
function setupDashboard() {
    // Create dashboard section in HTML if it doesn't exist
    if (!document.getElementById('dashboard-section')) {
        const container = document.querySelector('.container');
        container.insertAdjacentHTML('beforeend', `
            <div id="dashboard-section" class="section hidden">
                <h1>Your Learning Dashboard</h1>
                <div class="user-info">
                    <span id="dashboard-user-display"></span>
                    <button id="dashboard-logout-btn">Logout</button>
                </div>
                
                <div class="dashboard-cards">
                    <div class="dashboard-card">
                        <h3>Overall Progress</h3>
                        <div class="chart-container">
                            <canvas id="overall-progress-chart"></canvas>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <h3>Recent Activity</h3>
                        <div id="recent-activity"></div>
                    </div>
                </div>
                
                <div class="dashboard-cards">
                    <div class="dashboard-card">
                        <h3>Performance by Topic</h3>
                        <div class="chart-container">
                            <canvas id="topic-performance-chart"></canvas>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <h3>Time Analysis</h3>
                        <div class="chart-container">
                            <canvas id="time-analysis-chart"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-footer">
                    <button id="download-report-btn">Download Report</button>
                    <button id="return-to-topics-btn">Return to Topics</button>
                </div>
            </div>
        `);
        
        // Add event listeners for new buttons
        document.getElementById('dashboard-logout-btn').addEventListener('click', handleLogout);
        document.getElementById('return-to-topics-btn').addEventListener('click', showTopicsSection);
        document.getElementById('download-report-btn').addEventListener('click', downloadReport);
    }
}

// Extend user object to store quiz history
function initializeUserHistory() {
    if (!currentUser.quizHistory) {
        currentUser.quizHistory = [];
        saveUsers();
    }
}

// Save a completed quiz to user history
function saveQuizToHistory(topic, score, timeSpent, date = new Date()) {
    initializeUserHistory();
    
    currentUser.quizHistory.push({
        topic,
        score,
        timeSpent,
        date: date.toISOString(),
        questions: quizQuestions.length,
        correctAnswers: userAnswers.filter(a => a.userAnswer === a.correctAnswer).length
    });
    
    // Keep only the last 10 quizzes for storage efficiency
    if (currentUser.quizHistory.length > 10) {
        currentUser.quizHistory = currentUser.quizHistory.slice(-10);
    }
    
    saveUsers();
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('quizUsers', JSON.stringify(users));
}

// Show the dashboard with user data
function showDashboard() {
    setupDashboard();
    
    // Hide other sections
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    topicsSection.classList.add('hidden');
    quizSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    reviewSection.classList.add('hidden');
    
    // Show dashboard
    const dashboardSection = document.getElementById('dashboard-section');
    dashboardSection.classList.remove('hidden');
    
    // Update user display
    document.getElementById('dashboard-user-display').textContent = `Welcome, ${currentUser.username}!`;
    
    // Generate charts and data displays
    initializeUserHistory();
    renderDashboardCharts();
    renderRecentActivity();
}

// Generate charts for the dashboard
function renderDashboardCharts() {
    // Dynamically load Chart.js from CDN if not already loaded
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = actuallyRenderCharts;
        document.head.appendChild(script);
    } else {
        actuallyRenderCharts();
    }
}

function actuallyRenderCharts() {
    // Overall progress chart
    renderOverallProgressChart();
    
    // Topic performance chart
    renderTopicPerformanceChart();
    
    // Time analysis chart
    renderTimeAnalysisChart();
}

function renderOverallProgressChart() {
    const ctx = document.getElementById('overall-progress-chart').getContext('2d');
    
    // Calculate average progress across all topics
    const topics = Object.keys(currentUser.progress);
    const progressValues = topics.map(topic => currentUser.progress[topic]);
    const avgProgress = progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;
    
    // Create or update chart
    if (window.overallChart) {
        window.overallChart.destroy();
    }
    
    window.overallChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [avgProgress, 100 - avgProgress],
                backgroundColor: ['#3498db', '#ecf0f1'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
    
    // Add center text
    const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
    Chart.controllers.doughnut = Chart.controllers.doughnut.extend({
        draw: function() {
            originalDoughnutDraw.apply(this, arguments);
            
            const chart = this.chart;
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;
            
            ctx.font = "bold 30px 'Segoe UI'";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#2c3e50';
            ctx.fillText(`${Math.round(avgProgress)}%`, width / 2, height / 2);
        }
    });
}

function renderTopicPerformanceChart() {
    const ctx = document.getElementById('topic-performance-chart').getContext('2d');
    
    // Get data for topic performances
    const topics = Object.keys(currentUser.progress);
    const progressValues = topics.map(topic => currentUser.progress[topic]);
    
    // Format topic names for display
    const formattedTopics = topics.map(topic => 
        topic.charAt(0).toUpperCase() + topic.slice(1)
    );
    
    // Create or update chart
    if (window.topicChart) {
        window.topicChart.destroy();
    }
    
    window.topicChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: formattedTopics,
            datasets: [{
                label: 'Progress (%)',
                data: progressValues,
                backgroundColor: '#3498db',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderTimeAnalysisChart() {
    const ctx = document.getElementById('time-analysis-chart').getContext('2d');
    
    // If no quiz history, show placeholder
    if (!currentUser.quizHistory || currentUser.quizHistory.length === 0) {
        const noDataElem = document.createElement('div');
        noDataElem.className = 'no-data-message';
        noDataElem.textContent = 'Complete quizzes to see your time analysis';
        
        const container = document.getElementById('time-analysis-chart').parentNode;
        container.innerHTML = '';
        container.appendChild(noDataElem);
        return;
    }
    
    // Get time data from most recent quizzes (up to 5)
    const recentQuizzes = [...currentUser.quizHistory].reverse().slice(0, 5).reverse();
    
    // Format dates for display
    const labels = recentQuizzes.map(quiz => {
        const date = new Date(quiz.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    // Get time in minutes
    const timeData = recentQuizzes.map(quiz => Math.round(quiz.timeSpent / 60 * 10) / 10);
    
    // Create or update chart
    if (window.timeChart) {
        window.timeChart.destroy();
    }
    
    window.timeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Time (minutes)',
                data: timeData,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' min';
                        }
                    }
                }
            }
        }
    });
}

// Render recent activity on the dashboard
function renderRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    activityContainer.innerHTML = '';
    
    if (!currentUser.quizHistory || currentUser.quizHistory.length === 0) {
        activityContainer.innerHTML = '<p class="no-data-message">No recent activity</p>';
        return;
    }
    
    // Get the 5 most recent activities
    const recentActivities = [...currentUser.quizHistory].reverse().slice(0, 5);
    
    recentActivities.forEach(activity => {
        const date = new Date(activity.date);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const percentage = Math.round((activity.correctAnswers / activity.questions) * 100);
        
        const activityElem = document.createElement('div');
        activityElem.className = 'activity-item';
        
        activityElem.innerHTML = `
            <div class="activity-date">${formattedDate}</div>
            <div class="activity-details">
                <div class="activity-topic">${activity.topic.charAt(0).toUpperCase() + activity.topic.slice(1)}</div>
                <div class="activity-score ${percentage >= 70 ? 'good-score' : 'needs-improvement'}">
                    ${percentage}% (${activity.correctAnswers}/${activity.questions})
                </div>
            </div>
        `;
        
        activityContainer.appendChild(activityElem);
    });
}

// Download report as PDF
function downloadReport() {
    // Check if we need to load the PDF library
    if (typeof html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = generatePDF;
        document.head.appendChild(script);
    } else {
        generatePDF();
    }
}

function generatePDF() {
    // Create a temporary div for the report content
    const reportContent = document.createElement('div');
    reportContent.className = 'report-content';
    
    // Add report header
    reportContent.innerHTML = `
        <div class="report-header">
            <h1>QuizMaster Progress Report</h1>
            <h2>${currentUser.username}</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="report-section">
            <h3>Overall Progress</h3>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Topic</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(currentUser.progress).map(([topic, progress]) => `
                        <tr>
                            <td>${topic.charAt(0).toUpperCase() + topic.slice(1)}</td>
                            <td>${progress}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Add quiz history if available
    if (currentUser.quizHistory && currentUser.quizHistory.length > 0) {
        reportContent.innerHTML += `
            <div class="report-section">
                <h3>Quiz History</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Topic</th>
                            <th>Score</th>
                            <th>Time Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentUser.quizHistory.map(quiz => {
                            const date = new Date(quiz.date);
                            const formattedDate = date.toLocaleDateString();
                            const minutes = Math.floor(quiz.timeSpent / 60);
                            const seconds = quiz.timeSpent % 60;
                            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                            
                            return `
                                <tr>
                                    <td>${formattedDate}</td>
                                    <td>${quiz.topic.charAt(0).toUpperCase() + quiz.topic.slice(1)}</td>
                                    <td>${quiz.correctAnswers}/${quiz.questions} (${Math.round((quiz.correctAnswers/quiz.questions)*100)}%)</td>
                                    <td>${formattedTime}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Add recommendations
    reportContent.innerHTML += `
        <div class="report-section">
            <h3>Recommendations</h3>
            <ul>
                ${Object.entries(currentUser.progress)
                    .filter(([_, progress]) => progress < 70)
                    .map(([topic, _]) => `
                        <li>Focus more on ${topic.charAt(0).toUpperCase() + topic.slice(1)} to improve your skills.</li>
                    `).join('')}
                ${Object.entries(currentUser.progress).every(([_, progress]) => progress >= 70) ? 
                    '<li>Great job! Consider challenging yourself with more advanced topics.</li>' : ''}
            </ul>
        </div>
    `;
    
    // Temporarily add to document
    document.body.appendChild(reportContent);
    
    // Generate PDF
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `quizmaster_report_${currentUser.username}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(reportContent).save().then(() => {
        // Remove temporary element
        document.body.removeChild(reportContent);
    });
}

// Modify existing functions to include new features

// Update showResults function to save quiz and add dashboard button
const originalShowResults = showResults;
showResults = function() {
    originalShowResults();
    
    // Save this quiz to user history
    const score = (userAnswers.filter(answer => 
        answer.userAnswer === answer.correctAnswer
    ).length / quizQuestions.length) * 100;
    
    saveQuizToHistory(currentTopic, score, timeSpent);
    
    // Add dashboard button if not already there
    if (!document.getElementById('view-dashboard-btn')) {
        const buttonsContainer = document.querySelector('.buttons-container');
        const dashboardBtn = document.createElement('button');
        dashboardBtn.id = 'view-dashboard-btn';
        dashboardBtn.textContent = 'View Dashboard';
        dashboardBtn.addEventListener('click', showDashboard);
        buttonsContainer.appendChild(dashboardBtn);
    }
}

// Add dashboard button to topics section
const addDashboardButtonToTopics = function() {
    if (!document.getElementById('topics-dashboard-btn')) {
        const userInfo = document.querySelector('.user-info');
        const dashboardBtn = document.createElement('button');
        dashboardBtn.id = 'topics-dashboard-btn';
        dashboardBtn.textContent = 'Dashboard';
        dashboardBtn.addEventListener('click', showDashboard);
        
        // Insert before logout button
        userInfo.insertBefore(dashboardBtn, document.getElementById('logout-btn'));
    }
}

// Modify showTopicsSection to include dashboard button
const originalShowTopicsSection = showTopicsSection;
showTopicsSection = function() {
    originalShowTopicsSection();
    addDashboardButtonToTopics();
}

// Call this to ensure dashboard button appears after login
document.addEventListener('DOMContentLoaded', function() {
    // Hook into login and register functions
    const originalHandleLogin = handleLogin;
    handleLogin = function() {
        originalHandleLogin();
        if (currentUser) {
            addDashboardButtonToTopics();
        }
    }
    
    const originalHandleRegister = handleRegister;
    handleRegister = function() {
        originalHandleRegister();
        if (currentUser) {
            addDashboardButtonToTopics();
        }
    }
});
// Initialize the app
showLoginSection();
