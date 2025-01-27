import { fetchUser } from '../../db/Apis/GET.js';
import { updateUserExam } from '../../db/Apis/POST.js';

// Retrieve user and exam data
const { firstName } = JSON.parse(localStorage.getItem('user'));
const { userId, examId, score } = Object.fromEntries(
  new URLSearchParams(window.location.search).entries()
);

// DOM Elements
const resultText = document.querySelector('#resultText');
const container = document.querySelector('.result-page');
const resultImg = document.querySelector('#resultImg');
const homeBtn = document.querySelector('#homeBtn');

// Determine exam result and status
const getStatusMessage = (score, name) => {
  if (score == -1) {
    return {
      message: `Time's out, ${name}`,
      status: 'fail',
      color: 'rgb(185, 31, 31)',
      src: '../../assets/images/timeout.png',
    };
  }
  if (score < 50) {
    return {
      message: `You failed, ${name}`,
      status: 'fail',
      color: 'red',
      src: '../../assets/images/fail.webp',
    };
  }

  return {
    message: `You passed, ${name}!`,
    status: 'success',
    color: 'green',
    src: '../../assets/images/success.png',
  };
};

const { message, status, color, src } = getStatusMessage(score, firstName);
resultImg.src = src;

resultText.textContent = message;
resultText.style.color = color;
// Event Listener: Update user exam and navigate to home
homeBtn.addEventListener('click', async () => {
  const updatedExamData = {
    examId: Number(examId),
    status,
    score,
  };

  let user = JSON.parse(localStorage.getItem('userData'));
  if (!user) {
    [user] = await fetchUser(userId);
  }
  // Update user's exam data
  const examsIndex = user.exams.findIndex(
    (exam) => exam.examId === Number(examId)
  );
  if (examsIndex !== -1) {
    user.exams[examsIndex] = updatedExamData;
  } else {
    user.exams.push(updatedExamData);
  }

  // Save updated user data and send to backend
  localStorage.setItem('userData', JSON.stringify(user));
  await updateUserExam(userId, examId, updatedExamData);

  // Redirect to home page
  history.replaceState(null, '', `../Home/home.html?userId=${userId}`);
  location.href = `../Home/home.html?userId=${userId}`;
});
