import { fetchUser, fetchUsers } from './GET.js';

export async function createUser(user) {
  try {
    const response = await fetch(`http://localhost:3000/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: JSON.stringify(user), // Serialize the user object as JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Return the created user data
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

//Original
export async function updateUserExam(userId, examId, updatedExamData) {
  try {
    const [user] = await fetchUser(userId);
    const examIndex = user.exams.findIndex((exam) => exam.examId == examId);
    if (examIndex === -1) {
      throw new Error(`Exam with ID ${examId} not found for user ${userId}`);
    }
    user.exams[examIndex] = updatedExamData;

    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedUser = await response.json();
    return updatedUser; // Return the updated user data
  } catch (error) {
    console.error('Error updating user exam:', error);
    return null;
  }
}

// New
// export async function updateUserExam(userId, examId, updatedExam) {
//   try {
//     const users = await fetchUsers();
//     const userIndex = users.findIndex((user) => user.id == userId);
//     if (userIndex === -1) {
//       throw new Error('User not found');
//     }
//     const user = users[userIndex];
//     const examIndex = user.exams.findIndex((exam) => exam.examId == examId);
//     if (examIndex === -1) {
//       throw new Error('Exam not found');
//     }

//     // Update the exam in the user's exams array
//     user.exams[examIndex] = updatedExam;

//     // Log to check if the data is updated

//     // Now update the users data on the server
//     const response = await fetch('http://localhost:3000/users', {
//       method: 'PUT',  // Use PUT for updating the entire users array
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(users), // Ensure you're sending the updated users array
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // Optionally return the updated users array or some confirmation
//     const updatedUsers = await response.json();
//     return updatedUsers; // Return the updated users data from the server

//   } catch (error) {
//     console.error('Error updating user exam:', error);
//     return null;
//   }
// }
