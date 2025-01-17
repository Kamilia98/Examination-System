import { fetchUser, fetchExam } from '../../db/Apis/GET.js';

//local stoarge
const { firstName, lastName } = JSON.parse(localStorage.getItem('user'));

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  location.href = '../../index.html';
});

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
console.log(`Extracted userId: ${userId}`);
let user = null;
async function getUser() {
  [user] = await fetchUser(userId);
  displayExams(user.exams);
}

getUser();

function displayExams(exams) {
  const examsContainer = document.querySelector('#exams');
  console.log(examsContainer);
  exams.map(async (exam) => {
    console.log(exam);
    const [ex] = await fetchExam(exam.examId);
    const e = document.createElement('div');
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = ex.title;
    e.appendChild(titleDiv);
    if (exam.status == 'success') {
      e.style.color = 'green';
    } else if (exam.status == 'fail') {
      e.style.color = 'red';
    } else {
      const link = document.createElement('a');
      link.textContent = 'Start Exam';
      link.href = `../Exam/exam.html?examId=${exam.examId}`;
      e.appendChild(link);
    }

    examsContainer.appendChild(e);
  });
}
