import { fetchUsers } from '../../db/Apis/GET.js';

// DOM Elements
const loginForm = document.querySelector('#loginForm');
const eyeIcons = loginForm.querySelectorAll('.eye-icon');

const inputs = {
  email: loginForm.querySelector('#emailInput'),
  password: loginForm.querySelector('#passwordInput'),
};

const [emailError, passwordError, formError] = [
  ...loginForm.querySelectorAll('.error-message'),
];

const errors = { email: emailError, password: passwordError, form: formError };

// Toggle Password Visibility
eyeIcons.forEach((icon) => {
  icon.addEventListener('click', (e) => {
    if (e.target.tagName === 'I') {
      e.target.classList.toggle('fa-eye');
      e.target.classList.toggle('fa-eye-slash');
      const passwordInput = e.target
        .closest('.password-input')
        .querySelector('input');
      passwordInput.type =
        passwordInput.type === 'password' ? 'text' : 'password';
    }
  });
});

// Form Submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  Object.values(errors).forEach((error) => error.classList.remove('show'));
  Object.values(inputs).forEach((input) => input.classList.remove('error'));

  try {
    const users = await fetchUsers();
    const user = users.find((u) => u.email === inputs.email.value);

    if (user) {
      if (user.password === inputs.password.value) {
        // Successful login
        localStorage.setItem(
          'user',
          JSON.stringify({
            firstName: user.fname,
            lastName: user.lname,
            id: user.id,
            gender: user.gender,
          })
        );
        history.replaceState(null, '', `../Home/home.html?userId=${user.id}`);
        location.href = `../Home/home.html?userId=${user.id}`;
      } else {
        // Incorrect password
        errors.password.classList.add('show');
        inputs.password.classList.add('error');
      }
    } else {
      // Email not found
      errors.email.classList.add('show');
      inputs.email.classList.add('error');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    errors.form.textContent = 'An error occurred. Please try again later.';
  }
});
