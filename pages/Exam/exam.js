import { fetchExam, fetchQuestions } from '../../db/Apis/GET.js';

// Extract exam ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const examId = urlParams.get('examId');
const difficulty = urlParams.get('difficulty');

// DOM elements
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const questionItem = document.querySelector('.question');
const questionNoItem = document.querySelector('#questionNo');

let questions = [];
let exam = {};
let index = 0;

// Event listeners for prev and next buttons
[prevBtn, nextBtn].forEach((btn, direction) => {
  btn.addEventListener('click', () =>
    navigateQuestions(direction === 0 ? -1 : 1)
  );
});

document.getElementById('submitBtn').addEventListener('click', () => {
  const answers = [];
  const questionsItems = document.querySelectorAll('.question');

  questionsItems.forEach((question, index) => {
    // Find the selected radio button for this question
    const selectedOption = question.querySelector(
      'input[type="radio"]:checked'
    );

    if (selectedOption) {
      // Store the value of the selected option
      answers.push(selectedOption.value);
    } else {
      answers.push(null);
    }
  });

  const answeredQuestions = answers.reduce((acc, a) => {
    if (a != null) {
      return acc + 1;
    } else {
      return acc;
    }
  }, 0);

  const modalTitle = document.getElementById('exampleModalLabel');
  const modalBody = document.querySelector('.modal-body');
  const confirmButton = document.getElementById('confirmButton'); // Target the confirm button

  modalTitle.textContent = `Start Exam: ${exam.title}`;
  modalBody.innerHTML = `<p>You answered ${answeredQuestions} of ${questions.length}, Are you sure you want to submit?</p>`;

  // Set the confirm button's behavior
  confirmButton.onclick = () => {
    let score = 0;
    answers.forEach((answer, i) => {
      if (answer == questions[i].correctAnswer) {
        score++;
      }
    });

    score = ((score / questions.length) * 100).toFixed(2);
    window.location.href = `../Result/result.html?userId=${userId}&examId=${examId}&score=${score}`;
  };
});

document.getElementById('flagBtn').addEventListener('click', () => {
  const cont = document.getElementById('markedQuestions');
  const exists = Array.from(cont.querySelectorAll('.markedQuestion')).some(
    (el) => el.dataset.index == index
  );
  if (!exists) {
    const q = document.createElement('div');
    q.classList.add('markedQuestion');
    q.dataset.index = index;
    const titleEl = document.createElement('div');
    titleEl.textContent = `question ${index + 1}`;
    q.appendChild(titleEl);
    const deletBtn = document.createElement('button');
    deletBtn.classList.add('deleteBtn');
    deletBtn.textContent = 'Delete';
    q.appendChild(deletBtn);
    cont.appendChild(q);
  }
});

document.getElementById('markedQuestions').addEventListener('click', (e) => {
  if (e.target.classList.contains('deleteBtn')) {
    e.target.parentElement.remove();
  } else if (e.target.closest('.markedQuestion')) {
    index = Number(e.target.closest('.markedQuestion').dataset.index);
    displayQuestion(index);
  }
});

// Fetch questions
(async function initializeQuestions(examId) {
  try {
    questions = await fetchQuestions(examId, difficulty);

    if (questions.length) {
      // Shuffle the questions array
      questions = shuffleArray(questions);

      // Append and display questions
      appendQuestions(questions);
      displayQuestion(0);
    } else {
      questionItem.textContent = 'No questions available for this exam.';
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    questionItem.textContent =
      'Failed to load questions. Please try again later.';
  }
})(examId);

// Utility function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

(async function getExam(examId) {
  try {
    [exam] = await fetchExam(examId);
    showTimer(exam.duration * 60);
    showTitle(exam.title);
  } catch (error) {
    console.error('Error fetching exam:', error);
  }
})(examId);

function showTimer(examtime = 5 * 60) {
  const timeEl = document.getElementById('examTime');
  timeEl.textContent = `${String(Math.floor(examtime / 60)).padStart(
    2,
    '0'
  )}:${String(examtime % 60).padStart(2, '0')}`;
  examtime--;
  setInterval(() => {
    timeEl.textContent = `${String(Math.floor(examtime / 60)).padStart(
      2,
      '0'
    )}:${String(examtime % 60).padStart(2, '0')}`;
    examtime--;
    if (examtime == 0) {
      location.href = `../Result/result.html?userId=${userId}&examId=${examId}&score=-1`;
    }
  }, 1000);
}

function showTitle(examTitle) {
  document.getElementById('examTitle').textContent = examTitle;
}

// Navigate questions
function navigateQuestions(step) {
  const newIndex = index + step;
  if (newIndex >= 0 && newIndex < questions.length) {
    index = newIndex;
    displayQuestion(index);
  }
}

function appendQuestions(questions) {
  const questionsContainer = document.getElementById('questions');
  questions.forEach((question, inx) => {
    //create question
    const questionItem = document.createElement('div');
    questionItem.classList.add('question');
    questionItem.classList.add('hidden');
    //question header
    const questionText = createElement('p', { textContent: question.text });
    questionItem.appendChild(questionText);

    //options
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
      questionItem.appendChild(optionsList);

      optionItem.append(radioInput, label);
      optionsList.appendChild(optionItem);
    });

    questionsContainer.appendChild(questionItem);
  });
}
// Display one question
function displayQuestion(currentIndex) {
  const questions = document.getElementsByClassName('question');
  Array.from(questions).forEach((q, i) => {
    if (currentIndex == i) {
      q.classList.remove('hidden');
    } else {
      q.classList.add('hidden');
    }
  });
  questionNoItem.textContent = `${currentIndex + 1}/${questions.length}`;
}

function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  Object.assign(element, attributes);
  return element;
}
