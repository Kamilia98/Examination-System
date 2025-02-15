export async function fetchUsers() {
  try {
    const response = await fetch(`http://localhost:3000/users`, {
      method: 'GET',
    });

    if (!response.ok) {
      location.href = '../../pages/Error/error.html';
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    location.href = '../../pages/Error/error.html';
    return null;
  }
}

export async function fetchUser(id) {
  try {
    const response = await fetch(`http://localhost:3000/users?id=${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    location.href = '../../pages/Error/error.html';
    return null;
  }
}

export async function fetchExams() {
  try {
    const response = await fetch(`http://localhost:3000/exams`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    location.href = '../../pages/Error/error.html';
    return null;
  }
}

export async function fetchExam(id) {
  try {
    const response = await fetch(`http://localhost:3000/exams?id=${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    location.href = '../../pages/Error/error.html';
    return null;
  }
}

export async function fetchQuestions(id, difficulty) {
  try {
    const response = await fetch(
      `http://localhost:3000/questions?examId=${id}&difficulty=${difficulty}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      location.href = '../../pages/Error/error.html';
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    location.href = '../../pages/Error/error.html';
    return null;
  }
}
