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

// Error Messages
const errorMessages = {
  email: {
    required: 'Email is required.',
    invalid: 'Please enter a valid email address.',
    notFound: 'This email is not registered.',
  },
  password: {
    required: 'Password is required.',
    incorrect: 'Incorrect password. Please try again.',
  },
};

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

// Validate Email Format
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Form Submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  Object.values(errors).forEach((error) => {
    error.classList.remove('show');
    error.textContent = ''; // Reset error message
  });
  Object.values(inputs).forEach((input) => input.classList.remove('error'));

  // Validate inputs
  const validationResults = {
    email: inputs.email.value ? validateEmail(inputs.email.value) : null,
    password: inputs.password.value ? true : null, // Just checking if it's empty
  };

  // Display validation errors
  Object.keys(validationResults).forEach((key) => {
    if (validationResults[key] === null) {
      // Field is empty
      errors[key].textContent = errorMessages[key].required;
    } else if (validationResults[key] === false) {
      // Field is not empty but invalid
      errors[key].textContent = errorMessages[key].invalid;
    }

    if (validationResults[key] === null || validationResults[key] === false) {
      errors[key].classList.add('show');
      inputs[key].classList.add('error');
    }
  });

  // Stop if validation fails
  if (!Object.values(validationResults).every(Boolean)) return;

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
        errors.password.textContent = errorMessages.password.incorrect;
        errors.password.classList.add('show');
        inputs.password.classList.add('error');
      }
    } else {
      // Email not found
      errors.email.textContent = errorMessages.email.notFound;
      errors.email.classList.add('show');
      inputs.email.classList.add('error');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    errors.form.textContent = 'An error occurred. Please try again later.';
    errors.form.classList.add('show');
  }
});
