const user = localStorage.getItem('user');
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  location.href = '../../index.html';
});

// function fetchUser(userId) {
//   fetch(`http://localhost:3000/users?id=${userId}`, {
//     method: 'GET',
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(([user]) => {
//       fetchExams(user.exams);
//     })
//     .catch((error) => {
//       console.error('Error fetching user:', error);
//     });
// }

// function fetchExams(userExams) {
//   const examIds = userExams.map((exam) => exam.examId);
//   fetch('http://localhost:3000/exams')
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       const userExamsDetails = data.filter((exam) =>
//         examIds.includes(Number(exam.id))
//       );
//       console.log(userExamsDetails);
//     })
//     .catch((error) => {
//       console.error('Error fetching exams:', error);
//     });
// }

fetchUser(1);
