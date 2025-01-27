import { fetchUser } from '../../db/Apis/GET.js';
import { updateUserExam } from '../../db/Apis/POST.js';

// Retrieve original parameters from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const currentExamId = localStorage.getItem('currentExamId');
const CurentExamScore = localStorage.getItem('currentExamScore');
const { examId } = Object.fromEntries(
  new URLSearchParams(window.location.search).entries()
);

// Define the original URL parameters
const originalParams = {
  userId: user.id,
  examId: currentExamId,
  score: CurentExamScore,
};

// Construct the original URL
const originalUrl = `../Result/result.html?userId=${originalParams.userId}&examId=${originalParams.examId}&score=${originalParams.score}`;

// Function to check and enforce original URL
(function enforceOriginalUrl() {
  const currentParams = new URLSearchParams(window.location.search);

  // Redirect if any parameter doesn't match
  if (
    currentParams.get('userId') !== String(originalParams.userId) ||
    currentParams.get('examId') !== String(originalParams.examId) ||
    currentParams.get('score') !== String(originalParams.score)
  ) {
    window.location.href = originalUrl; // Redirect to the original URL
  }
})();

// DOM Elements
const resultText = document.querySelector('#resultText');
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

// Get result data and update the page
const { message, status, color, src } = getStatusMessage(
  Number(CurentExamScore),
  user.firstName
);
resultImg.src = src;
resultText.textContent = message;
resultText.style.color = color;

// Event Listener: Update user exam and navigate to home
homeBtn.addEventListener('click', async () => {
  const updatedExamData = {
    examId: Number(currentExamId),
    status,
    score: CurentExamScore,
  };

  let userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData) {
    [userData] = await fetchUser(originalParams.userId);
  }

  // Update user's exam data
  const examsIndex = userData.exams.findIndex(
    (exam) => exam.examId === Number(examId)
  );
  if (examsIndex !== -1) {
    userData.exams[examsIndex] = updatedExamData;
  } else {
    userData.exams.push(updatedExamData);
  }

  // Save updated user data and send to backend
  localStorage.setItem('userData', JSON.stringify(userData));
  await updateUserExam(user.id, currentExamId, updatedExamData);

  // Redirect to home page
  history.replaceState(null, '', `../Home/home.html?userId=${userData.id}`);
  location.href = `../Home/home.html?userId=${userData.id}`;
});
