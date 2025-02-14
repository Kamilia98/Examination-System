import { fetchExam, fetchQuestions } from '../../db/Apis/GET.js';

// Extract exam ID, user ID, and difficulty from URL parameters
const { userId, examId, difficulty } = Object.fromEntries(
  new URLSearchParams(window.location.search).entries()
);

const user = JSON.parse(localStorage.getItem('user'));

const currentExamId = localStorage.getItem('currentExamId');
const currentExamDifficulty = localStorage.getItem('currentExamDifficulty');
const originalParams = {
  userId: user.id,
  examId: currentExamId,
  difficulty: currentExamDifficulty,
};

const originalUrl = `../Exam/exam.html?userId=${originalParams.userId}&examId=${originalParams.examId}&difficulty=${originalParams.difficulty}`;

// Function to check and enforce original URL
(function enforceOriginalUrl() {
  const currentParams = new URLSearchParams(window.location.search);

  // Redirect if any parameter doesn't match
  if (
    currentParams.get('userId') !== String(originalParams.userId) ||
    currentParams.get('examId') !== String(originalParams.examId) ||
    currentParams.get('difficulty') !== String(originalParams.difficulty)
  ) {
    window.location.href = originalUrl; // Redirect to the original URL
  }
})();

// DOM Elements
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const submitBtn = document.querySelector('#submitBtn');
const flagBtn = document.querySelector('#flagBtn');
const questionNoItem = document.querySelector('#questionNo');
const markedQuestionsContainer = document.querySelector('#markedQuestions');
const loader = document.getElementById('loader');
const page = document.getElementById('page');
const userName = document.getElementById('userName');
const profilePicture = document.querySelector('.profilePic');

let questions = [];
let exam = {};
let index = 0;

// Show loader initially
loader.classList.remove('hidden');

// Event listeners for navigation buttons
prevBtn.addEventListener('click', () => navigateQuestions(-1));
nextBtn.addEventListener('click', () => navigateQuestions(1));

// Submit exam answers
submitBtn.addEventListener('click', handleSubmit);

// Flag question as marked
flagBtn.addEventListener('click', markQuestionAsFlagged);

// Initialize and fetch data
(async function initializeData() {
  try {
    // Fetch questions and exam data
    questions = await fetchQuestions(examId, difficulty);

    if (questions.length) {
      questions = shuffleArray(questions); // Shuffle questions
      appendQuestions(questions); // Append questions to DOM
      displayQuestion(index); // Display first question
    }

    [exam] = await fetchExam(examId);
    showTitle(exam.title);
    showTimer(exam.duration * 60);
    userName.textContent = `${user.firstName} ${user.lastName}`;
    // Hide loader and show page content
    loader.classList.add('hidden');
    page.classList.remove('hidden');
    profilePicture.src = `../../assets/images/${
      user.gender === 'F' ? 'fe' : ''
    }male.png`;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Ensure loader is hidden even if there's an error
    loader.classList.add('hidden');
  }
})();

// Shuffle array function (Fisher-Yates Shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Display timer
function showTimer(examTime = 5 * 60) {
  const timeEl = document.querySelector('#examTime');
  timeEl.textContent = formatTime(examTime);
  if (examTime <= 59) {
    timeEl.parentElement.style.color = 'red';
  }

  setInterval(() => {
    if (examTime <= 0) {
      history.replaceState(
        null,
        '',
        `../Result/result.html?userId=${userId}&examId=${examId}&score=-1`
      );
      location.href = `../Result/result.html?userId=${userId}&examId=${examId}&score=-1`;
    } else {
      timeEl.textContent = formatTime(--examTime);
    }
    if (examTime <= 59) {
      timeEl.classList.remove('text-light');
      timeEl.classList.add('text-danger');
    }
  }, 1000);
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;
}

// Display exam title
function showTitle(examTitle) {
  document.querySelector('#examTitle').textContent = examTitle;
}

// Display question
function displayQuestion(currentIndex) {
  const questions = document.querySelectorAll('.question');
  questions.forEach((q, i) => {
    q.classList.toggle('hidden', i !== currentIndex);
  });
  questionNoItem.textContent = `${currentIndex + 1}/${questions.length}`;
}

// Navigate between questions
function navigateQuestions(step) {
  const newIndex = index + step;
  if (newIndex >= 0 && newIndex < questions.length) {
    index = newIndex;
    displayQuestion(index);
  }
}

// Submit exam answers
function handleSubmit() {
  const answers = [];
  const questionsItems = document.querySelectorAll('.question');

  questionsItems.forEach((question, index) => {
    const selectedOption = question.querySelector(
      'input[type="radio"]:checked'
    );
    answers.push(selectedOption ? selectedOption.value : null);
  });

  const answeredQuestions = answers.filter((a) => a !== null).length;
  const modalTitle = document.querySelector('#exampleModalLabel');
  const modalBody = document.querySelector('.modal-body');
  const confirmButton = document.querySelector('#confirmButton');

  modalTitle.textContent = `Submit Exam: ${exam.title}`;
  modalBody.innerHTML = `<p>You answered <span style="color:red">
  
  ${answeredQuestions} 
  </span> out
  of ${questions.length}. Are you sure you want to submit?</p>`;

  confirmButton.onclick = () => {
    let score = answers.reduce(
      (score, answer, i) => score + (answer == questions[i].correctAnswer),
      0
    );
    score = ((score / questions.length) * 100).toFixed(2);
    localStorage.setItem('currentExamScore', score);
    history.replaceState(
      null,
      '',
      `../Result/result.html?userId=${userId}&examId=${examId}&score=${score}`
    );
    location.href = `../Result/result.html?userId=${userId}&examId=${examId}&score=${score}`;
  };
}

// Mark question as flagged
function markQuestionAsFlagged() {
  const exists = Array.from(
    markedQuestionsContainer.querySelectorAll('.marked-question')
  ).some((el) => el.dataset.index == index);
  if (!exists) {
    const markedQuestionEl = createElement('div', {
      className: 'marked-question',
      dataset: { index },
    });
    const titleEl = createElement('div', {
      textContent: `Question ${index + 1}`,
    });
    const deleteBtn = createElement('button', {
      className: 'delete-btn',
      innerHTML: "<i class='fa-solid fa-trash'></i>",
    });

    markedQuestionEl.append(titleEl, deleteBtn);
    markedQuestionsContainer.appendChild(markedQuestionEl);
  }
}

// Handle marked question list
markedQuestionsContainer.addEventListener('click', (e) => {
  if (
    e.target.parentElement.classList.contains('fa-trash') ||
    e.target.classList.contains('.delete-btn')
  ) {
    e.target.closest('.marked-question').remove();
  } else if (e.target.closest('.marked-question')) {
    index = Number(e.target.closest('.marked-question').dataset.index);
    displayQuestion(index);
  }
});

// Append questions to DOM
function appendQuestions(questions) {
  const questionsContainer = document.querySelector('#questions');
  questions.forEach((question, inx) => {
    const questionItem = createElement('div', {
      className: 'question hidden',
    });
    const questionText = createElement('p', {
      textContent: question.text,
      className: 'fw-bolder fs-5',
    });
    const optionsList = createElement('ul', {
      className: 'options list-unstyled ',
    });

    question.options.forEach((option, i) => {
      const optionItem = createElement('li');
      const radioInput = createElement('input', {
        type: 'radio',
        name: `questionOption${inx}`,
        id: `option${inx}${i}`,
        value: i,
      });
      const label = createElement('label', {
        htmlFor: `option${inx}${i}`,
        textContent: option,
        className: 'ms-2',
      });

      optionItem.append(radioInput, label);
      optionsList.appendChild(optionItem);
    });

    questionItem.append(questionText, optionsList);
    questionsContainer.appendChild(questionItem);
  });
}

// Utility to create elements
function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element[key] = value;
    }
  }
  return element;
}
