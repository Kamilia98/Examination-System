import { fetchExam, fetchQuestions } from '../../db/Apis/GET.js';

// Extract exam ID, user ID, and difficulty from URL parameters
const { userId, examId, difficulty } = Object.fromEntries(
  new URLSearchParams(window.location.search).entries()
);

// DOM Elements
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const submitBtn = document.querySelector('#submitBtn');
const flagBtn = document.querySelector('#flagBtn');
const questionNoItem = document.querySelector('#questionNo');
const markedQuestionsContainer = document.querySelector('#markedQuestions');

let questions = [];
let exam = {};
let index = 0;

// Event listeners for navigation buttons
[prevBtn, nextBtn].forEach((btn, direction) =>
  btn.addEventListener('click', () =>
    navigateQuestions(direction === 0 ? -1 : 1)
  )
);

// Submit exam answers
submitBtn.addEventListener('click', () => handleSubmit());

// Flag question as marked
flagBtn.addEventListener('click', () => markQuestionAsFlagged());

// Fetch exam and questions data
(async function initializeData() {
  try {
    questions = await fetchQuestions(examId, difficulty);

    if (questions.length) {
      questions = shuffleArray(questions); // Shuffle questions
      appendQuestions(questions);
      displayQuestion(0); // Display first question
    }

    [exam] = await fetchExam(examId);
    showTimer(exam.duration * 60);
    showTitle(exam.title);
  } catch (error) {
    console.error('Error fetching data:', error);
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

// Timer function
function showTimer(examTime = 5 * 60) {
  const timeEl = document.querySelector('#examTime');
  timeEl.textContent = formatTime(examTime);
  setInterval(() => {
    if (examTime <= 0) {
      window.location.href = `../Result/result.html?userId=${userId}&examId=${examId}&score=-1`;
    } else {
      timeEl.textContent = formatTime(examTime--);
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
  Array.from(questions).forEach((q, i) => {
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

// Handle the submission of the exam
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

  modalTitle.textContent = `Start Exam: ${exam.title}`;
  modalBody.innerHTML = `<p>You answered ${answeredQuestions} of ${questions.length}, Are you sure you want to submit?</p>`;

  confirmButton.onclick = () => {
    let score = answers.reduce(
      (score, answer, i) => score + (answer == questions[i].correctAnswer),
      0
    );
    score = ((score / questions.length) * 100).toFixed(2);
    window.location.href = `../Result/result.html?userId=${userId}&examId=${examId}&score=${score}`;
  };
}

// Mark question as flagged
function markQuestionAsFlagged() {
  const exists = Array.from(
    markedQuestionsContainer.querySelectorAll('.markedQuestion')
  ).some((el) => el.dataset.index == index);
  if (!exists) {
    const markedQuestionEl = createElement('div', {
      className: 'markedQuestion',
      dataset: { index },
    });
    const titleEl = createElement('div', {
      textContent: `Question ${index + 1}`,
    });
    const deleteBtn = createElement('button', {
      className: 'deleteBtn',
      textContent: 'Delete',
    });

    markedQuestionEl.append(titleEl, deleteBtn);
    markedQuestionsContainer.appendChild(markedQuestionEl);
  }
}

// Handle clicks on marked questions list
markedQuestionsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('deleteBtn')) {
    e.target.parentElement.remove();
  } else if (e.target.closest('.markedQuestion')) {
    index = Number(e.target.closest('.markedQuestion').dataset.index);
    displayQuestion(index);
  }
});

// Append questions to the DOM
function appendQuestions(questions) {
  const questionsContainer = document.querySelector('#questions');
  questions.forEach((question, inx) => {
    const questionItem = createElement('div', { className: 'question hidden' });
    const questionText = createElement('p', { textContent: question.text });
    const optionsList = createElement('ul', { className: 'options' });

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
      });

      optionItem.append(radioInput, label);
      optionsList.appendChild(optionItem);
    });

    questionItem.append(questionText, optionsList);
    questionsContainer.appendChild(questionItem);
  });
}

// Utility function to create elements
function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'dataset') {
      // Set dataset properties individually
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
    } else {
      element[key] = value;
    }
  }
  return element;
}
