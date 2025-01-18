import { updateUserExam } from '../../db/Apis/POST.js';

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const examId = urlParams.get('examId');
const score = Number(urlParams.get('score'));
console.log(userId, examId, score);

const resultItem = document.getElementById('result');
const homeBtn = document.getElementById('homeBtn');
let status;
if (score == -1) {
  resultItem.textContent = 'time outtttttttttttttt';
  status = 'fail';
} else if (score < 50) {
  resultItem.textContent = 'you failedddddddddddddd';
  status = 'fail';
} else if (score == 100) {
  resultItem.textContent = 'You got fulllllll scoreeee';
  status = 'success';
} else {
  resultItem.textContent = 'You passed';
  status = 'success';
}

homeBtn.addEventListener('click', () => {
  const updatedExamData = {
    examId: Number(examId),
    status,
    score, // Example updated score
  };

  updateUserExam(userId, examId, updatedExamData).then((updatedUser) => {
    if (updatedUser) {
      console.log('User exam updated successfully:', updatedUser);
    }
    location.href = `../Home/home.html?userId=${userId}`;
  });
});
