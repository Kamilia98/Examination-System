import { fetchUser, fetchExam } from '../../db/Apis/GET.js';

// Fetch and display user details
const { firstName } = JSON.parse(localStorage.getItem('user'));
document.querySelector('#welcomeText').textContent = `Welcome, ${firstName}`;

// Extract user ID from URL
const userId = new URLSearchParams(window.location.search).get('userId');

// Logout functionality
document.querySelector('#logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  location.href = '../Login/login.html';
});

// Fetch user data and display exams
(async function getUser() {
  const user =
    JSON.parse(localStorage.getItem('userData')) ||
    (await fetchUser(userId))[0];
  displayExams(user.exams);
})();

// Display exams in the UI
async function displayExams(userExams) {
  const examsContainer = document.querySelector('#exams');
  examsContainer.innerHTML = ''; // Clear existing content

  const examElements = await Promise.all(userExams.map(createExamElement));
  examElements.forEach((examElement) =>
    examsContainer.appendChild(examElement)
  );

  addButtonsEventlisteners(); // Attach event listeners after exams are rendered
}

// Create exam element
async function createExamElement(userExam) {
  const exam = await fetchExam(userExam.examId).then((exams) => exams[0]);
  const examElement = document.createElement('div');
  const examTitle = document.createElement('div');
  examTitle.innerHTML = exam.title;
  examElement.appendChild(examTitle);

  // Add difficulty select if exam status is pending
  if (userExam.status === 'pending') {
    examElement.appendChild(createDifficultySelect());
    examElement.appendChild(createStartButton(userExam.examId, exam.title));
  } else {
    examElement.style.color = userExam.status === 'success' ? 'green' : 'red';
    if (userExam.score !== null) {
      const scoreElement = document.createElement('span');
      scoreElement.textContent = `Score: ${userExam.score}`;
      examElement.appendChild(scoreElement);
    }
  }

  return examElement;
}

// Create difficulty select dropdown
function createDifficultySelect() {
  const select = document.createElement('select');
  const options = ['Easy', 'Medium', 'Hard'].map((level, index) => {
    const option = document.createElement('option');
    option.value = ['e', 'm', 'h'][index];
    option.textContent = level;
    return option;
  });
  select.append(...options);
  select.value = 'm'; // Default difficulty
  return select;
}

// Create 'Start Exam' button
function createStartButton(examId, examTitle) {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-primary', 'startBtn');
  button.textContent = 'Start Exam';
  button.dataset.exam = examId;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#exampleModal';
  button.dataset.examTitle = examTitle;
  return button;
}

// Add event listeners to start exam buttons
function addButtonsEventlisteners() {
  const modalTitle = document.querySelector('#exampleModalLabel');
  const modalBody = document.querySelector('.modal-body');
  const confirmButton = document.querySelector('#confirmButton');

  document.querySelectorAll('.startBtn').forEach((button) => {
    button.addEventListener('click', (e) => {
      const { exam, examTitle } = e.target.dataset;
      const difficulty = e.target.previousElementSibling.value; // Get selected difficulty

      modalTitle.textContent = `Start Exam: ${examTitle}`;
      modalBody.innerHTML = `<p>Are you sure you want to start the exam?</p><p>Difficulty: ${difficulty}</p>`;

      confirmButton.onclick = () => {
        window.location.href = `../Exam/exam.html?userId=${userId}&examId=${exam}&difficulty=${difficulty}`;
      };
    });
  });
}
