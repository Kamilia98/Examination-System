import { fetchUser } from '../../db/Apis/GET.js';
import { updateUserExam } from '../../db/Apis/POST.js';

const { firstName } = JSON.parse(localStorage.getItem('user'));

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const examId = urlParams.get('examId');
const score = Number(urlParams.get('score'));

const resultItem = document.getElementById('result');
const homeBtn = document.getElementById('homeBtn');
let status;
if (score == -1) {
  resultItem.textContent = `time outtttttttttttttt, ${firstName}`;
  status = 'fail';
} else if (score < 50) {
  resultItem.textContent = `you failedddddddddddddd, ${firstName}`;
  status = 'fail';
} else if (score == 100) {
  resultItem.textContent = `You got fulllllll scoreeee, ${firstName}`;
  status = 'success';
} else {
  resultItem.textContent = 'You passed';
  status = 'success';
}

homeBtn.addEventListener('click', async () => {
  const updatedExamData = {
    examId: Number(examId),
    status,
    score, // Example updated score
  };
  const u = localStorage.getItem('userData');
  let user;
  if (u) {
    user = JSON.parse(u);
  } else {
    [user] = await fetchUser(userId);
  }
  const examsIndex = user.exams.findIndex((exam) => exam.examId == examId);
  user.exams[examsIndex] = updatedExamData;
  localStorage.setItem('userData', JSON.stringify(user));
  updateUserExam(userId, examId, updatedExamData);
  location.href = `../Home/home.html?userId=${userId}`;
});
