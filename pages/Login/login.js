import { fetchUsers } from '../../db/Apis/GET.js';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  const emailError = emailInput
    .closest('.form-input')
    .querySelector('.error-message');
  const passwordError = passwordInput
    .closest('.form-input')
    .querySelector('.error-message');

  // Clear previous error messages
  emailError.textContent = '';
  passwordError.textContent = '';

  try {
    const users = await fetchUsers();
    const user = users.find((u) => u.email === emailInput.value);

    if (user) {
      if (user.password === passwordInput.value) {
        // Successful login
        localStorage.setItem(
          'user',
          JSON.stringify({
            firstName: user.fname,
            id: user.id,
          })
        );
        window.location.href = `../Home/home.html?userId=${user.id}`;
      } else {
        // Incorrect password
        passwordError.textContent = 'Password is not correct.';
      }
    } else {
      // Email not found
      passwordError.textContent = 'Email or Password is not correct.';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    passwordError.textContent = 'An error occurred. Please try again later.';
  }
});
