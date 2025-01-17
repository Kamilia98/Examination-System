import { fetchQuestions } from '../../db/Apis/GET.js';

const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get('examId');

async function getQuestions(examId) {
  const questions = await fetchQuestions(examId);
  displayQuestions(questions);
}
function displayQuestions(questions) {
  const questionsContainer = document.getElementById('questions');

  questions.map((q) => {
    console.log(q);

    const questionItem = document.createElement('li');
    const questionText = document.createElement('p');
    questionText.textContent = q.text;
    questionItem.appendChild(questionText);

    const optionsList = document.createElement('ul');
    optionsList.classList.add('options');
    q.options.map((option) => {
      const o = document.createElement('li');
      o.textContent = option;
      optionsList.appendChild(o);
    });

    questionItem.appendChild(optionsList);
    questionsContainer.appendChild(questionItem);
  });
}

getQuestions(examId);
