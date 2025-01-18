import { fetchUser } from './GET.js';

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
export async function updateUserExam(userId, examId, updatedExamData) {
  try {
    const [user] = await fetchUser(userId);
    const examIndex = user.exams.findIndex((exam) => exam.examId == examId);
    if (examIndex === -1) {
      throw new Error(`Exam with ID ${examId} not found for user ${userId}`);
    }

    user.exams[examIndex] = {
      ...user.exams[examIndex],
      ...updatedExamData,
    };
    console.log(user.exams);

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
