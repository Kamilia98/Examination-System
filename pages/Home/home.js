import { fetchUser, fetchExam } from '../../db/Apis/GET.js';

// First name to be used later
const { firstName } = JSON.parse(localStorage.getItem('user'));

//User Id
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
console.log(userId);

// Logout btn Event listener
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  location.href = '../../index.html';
});

// Initialize user Data
(async function getUser() {
  const [user] = await fetchUser(userId);
  displayExams(user.exams);
})();

function displayExams(userExams) {
  const examsContainer = document.querySelector('#exams');

  // Show exams
  userExams.map(async (userExam) => {
    const [exam] = await fetchExam(userExam.examId);

    const examElement = document.createElement('div');
    const examTitle = document.createElement('div');
    examTitle.innerHTML = exam.title;
    examElement.appendChild(examTitle);

    console.log(userExam.status); // Ensure you're logging the correct property

    // Apply styles based on userExam status
    if (userExam.status === 'success') {
      examElement.style.color = 'green'; // Green for success
      // Optionally append the score if available
      if (userExam.score !== null) {
        const scoreElement = document.createElement('span');
        scoreElement.textContent = `Score: ${userExam.score}`;
        examElement.appendChild(scoreElement);
      }
    } else if (userExam.status === 'fail') {
      // Corrected this condition
      examElement.style.color = 'red'; // Red for fail
      // Optionally append the score if available
      if (userExam.score !== null) {
        const scoreElement = document.createElement('span');
        scoreElement.textContent = `Score: ${userExam.score}`;
        examElement.appendChild(scoreElement);
      }
    } else {
      // Status is neither success nor fail; provide a link to start the exam
      const examLink = document.createElement('a');
      examLink.textContent = 'Start Exam';
      examLink.href = `../Exam/exam.html?userId=${userId}&examId=${userExam.examId}`;
      examElement.appendChild(examLink);
    }

    // Append the exam element to the container
    examsContainer.appendChild(examElement);
  });
}
