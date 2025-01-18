import { fetchExam, fetchQuestions } from '../../db/Apis/GET.js';

// Extract exam ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const examId = urlParams.get('examId');

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

  console.log(answers);
  let score = 0;
  answers.forEach((answer, i) => {
    console.log(questions[i]);
    if (answer == questions[i].correctAnswer) {
      score++;
    }
  });
  score = ((score / questions.length) * 100).toFixed(2);

  location.href = `../Result/result.html?userId=${userId}&examId=${examId}&score=${score}`;
});

// Fetch questions
(async function initializeQuestions(examId, index) {
  try {
    questions = await fetchQuestions(examId);
    if (questions.length) {
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
})(examId, index);

(async function getExam(examId) {
  try {
    [exam] = await fetchExam(examId);
    console.log(exam);
    showTimer(exam.time);
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
      console.log('time out');
    }
  }, 1000);
}

function showTitle(examTitle) {
  console.log(document.getElementById('examTitle'));
  console.log(examTitle);
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
    console.log(question);
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

  // // Question text
  // const questionText = createElement('p', { textContent: question.text });
  // questionItem.appendChild(questionText);

  // // Options list
  // const optionsList = createElement('ul', { className: 'options' });
  // question.options.forEach((option, i) => {
  //   const optionItem = createElement('li');
  //   const radioInput = createElement('input', {
  //     type: 'radio',
  //     name: 'questionOption',
  //     id: `option${i}`,
  //     value: option,
  //   });
  //   const label = createElement('label', {
  //     htmlFor: `option${i}`,
  //     textContent: option,
  //   });

  //   optionItem.append(radioInput, label);
  //   optionsList.appendChild(optionItem);
  // });

  // questionItem.appendChild(optionsList);

  // Update question number
  questionNoItem.textContent = `${currentIndex + 1}/${questions.length}`;
}

function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  Object.assign(element, attributes);
  return element;
}
