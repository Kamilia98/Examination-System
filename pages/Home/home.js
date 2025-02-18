import { fetchExam, fetchUser } from '../../db/Apis/GET.js';

// DOM Elements
const loader = document.getElementById('loader');
const page = document.getElementById('page');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeText = document.querySelector('#welcomeText');
const userName = document.querySelector('#userName');
const examsContainer = document.querySelector('#exams');
const profilePicture = document.querySelector('.profilePic');

// Constants
const user = JSON.parse(localStorage.getItem('user'));
const userId = new URLSearchParams(window.location.search).get('userId');

const originalParams = {
  currentUserId: user.id,
};

// Construct the original URL
const originalUrl = `../Home/home.html?userId=${originalParams.currentUserId}`;

// Function to check and enforce original URL
(function enforceOriginalUrl() {
  // Redirect if any parameter doesn't match
  if (userId !== String(originalParams.currentUserId)) {
    window.location.href = originalUrl; // Redirect to the original URL
  }
})();

// Initial Setup
loader.classList.remove('hidden');
page.classList.add('hidden');
welcomeText.textContent = `Welcome, ${user.firstName}!`;
userName.textContent = `${user.firstName} ${user.lastName}`;
profilePicture.src = `../../assets/images/${
  user.gender === 'F' ? 'fe' : ''
}male.png`;

// Event Listeners
logoutBtn.addEventListener('click', handleLogout);
document.addEventListener('click', handleStartExamClick);

// Functions
async function initializePage() {
  const userData =
    JSON.parse(localStorage.getItem('userData')) ||
    (await fetchUser(userId))[0];
  displayExamsStat(userData.exams);
  await displayExams(userData.exams);
  loader.classList.add('hidden');
  page.classList.remove('hidden');
}

function handleLogout() {
  localStorage.clear();
  history.replaceState(null, '', '../Registration/registration.html');
  location.href = '../Registration/registration.html';
}

function displayExamsStat(userExams) {
  const counts = userExams.reduce((acc, exam) => {
    acc[exam.status] = (acc[exam.status] || 0) + 1;
    return acc;
  }, {});

  const totalExams = userExams.length;
  const percentages = {
    success: ((counts.success || 0) / totalExams) * 100,
    fail: ((counts.fail || 0) / totalExams) * 100,
    pending: ((counts.pending || 0) / totalExams) * 100,
  };

  updateCircleChart(percentages);
  updatePercentageText(percentages);
}

function updateCircleChart(percentages) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const circles = document.querySelectorAll('.circle .circle-fill');

  // Iterate through percentages
  const colors = ['green', 'red', 'orange'];
  const types = ['success', 'fail', 'pending'];

  circles.forEach((circle, index) => {
    const percentage = percentages[types[index]];
    const offset = circumference - (circumference * percentage) / 100;

    // Set styles for the circle
    circle.style.stroke = colors[index];
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    circle.style.setProperty('--dash-offset', offset);

    // Trigger animation
    circle.style.animation = `dashAnim 1s ease-out forwards`;
  });
}

function updatePercentageText(percentages) {
  document.getElementById('successPercentage').textContent =
    percentages.success.toFixed(1);
  document.getElementById('failPercentage').textContent =
    percentages.fail.toFixed(1);
  document.getElementById('pendingPercentage').textContent =
    percentages.pending.toFixed(1);
}

async function displayExams(userExams) {
  examsContainer.innerHTML = '';
  const examElements = await Promise.all(userExams.map(createExamElement));
  examElements.forEach((examElement) =>
    examsContainer.appendChild(examElement)
  );
}

async function createExamElement(userExam) {
  const exam = await fetchExam(userExam.examId).then((exams) => exams[0]);
  const card = document.createElement('div');
  card.classList.add('col');
  card.innerHTML = `
    <div class="exam card h-100">
      <div class='exam-info'>
        <h5 class="card-title">${exam.title}</h5>
        <p class="card-text fw-bold" style="color: ${getStatusColor(
          userExam.status
        )};">Status: ${userExam.status}</p>
      </div>
      <div class="exam-actions">
        ${
          userExam.status !== 'success'
            ? getExamActions(userExam, exam)
            : getExamScore(userExam)
        }
      </div>
    </div>
  `;
  return card;
}

function getStatusColor(status) {
  return status === 'success' ? 'green' : status === 'fail' ? 'red' : 'orange';
}

function getExamActions(userExam, exam) {
  return `
    <label>Difficulty:</label>
    <select class="form-select">
      <option value="e">Easy</option>
      <option value="m" selected>Medium</option>
      <option value="h">Hard</option>
    </select>
    <button class="startBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" data-exam="${
      userExam.examId
    }" data-exam-title="${exam.title}">
      ${userExam.status === 'fail' ? 'Retake' : 'Start'} Exam
    </button>
  `;
}

function getExamScore(userExam) {
  return userExam.status === 'success'
    ? `<p class="card-text score">Score: ${Math.round(userExam.score)}%</p>`
    : '';
}

function handleStartExamClick(e) {
  if (e.target.classList.contains('startBtn')) {
    const modalTitle = document.querySelector('#exampleModalLabel');
    const modalBody = document.querySelector('.modal-body');
    const confirmButton = document.querySelector('#confirmButton');

    const { exam, examTitle } = e.target.dataset;
    const difficulty = e.target.closest('div').querySelector('select').value;

    modalTitle.textContent = `Start Exam: ${examTitle}`;
    modalBody.innerHTML = `<p>Are you sure you want to start the exam?</p><p style="color:red;">Difficulty: ${getDifficultyText(
      difficulty
    )}</p>`;

    confirmButton.onclick = () => {
      localStorage.setItem('currentExamId', exam);
      localStorage.setItem('currentExamDifficulty', difficulty);
      history.replaceState(
        null,
        '',
        `../Exam/exam.html?userId=${userId}&examId=${exam}&difficulty=${difficulty}`
      );
      location.href = `../Exam/exam.html?userId=${userId}&examId=${exam}&difficulty=${difficulty}`;
    };
  }
}

function getDifficultyText(difficulty) {
  return difficulty === 'm' ? 'medium' : difficulty === 'h' ? 'hard' : 'easy';
}

// Initialize the page
initializePage();
