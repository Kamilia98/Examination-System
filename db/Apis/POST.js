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
