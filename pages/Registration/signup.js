import { fetchUsers } from '../../db/Apis/GET.js';
import { createUser } from '../../db/Apis/POST.js';
import { goToLogin } from './navigate.js';

// DOM Elements
const signupForm = document.querySelector('#signupForm');
const eyeIcons = signupForm.querySelectorAll('.eye-icon');

// Input Fields
const inputs = {
  fName: signupForm.querySelector('#firstName'),
  lName: signupForm.querySelector('#lastName'),
  email: signupForm.querySelector('#email'),
  password: signupForm.querySelector('#password'),
  confirmPassword: signupForm.querySelector('#confirmPassword'),
  gender: signupForm.querySelectorAll('input[name="gender"]'),
};

const errorMessages = {
  fName: {
    required: 'First name is required.',
    invalid: '3-20 characters',
  },
  lName: {
    required: 'Last name is required.',
    invalid: '3-20 characters.',
  },
  email: {
    required: 'Email is required.',
    invalid: 'Please enter a valid email address.',
  },
  password: {
    required: 'Password is required.',
    invalid: 'Password must be 8+ characters with upper, lower, and a number.',
  },
  confirmPassword: {
    required: 'Please confirm your password.',
    invalid: 'Passwords do not match.',
  },
  gender: {
    required: 'Gender selection is required.',
  },
};
// Error Messages
const errors = {
  fName: inputs.fName.closest('.form-group').querySelector('.error-message'),
  lName: inputs.lName.closest('.form-group').querySelector('.error-message'),
  email: inputs.email.closest('.form-group').querySelector('.error-message'),
  gender: signupForm
    .querySelector('.form-group input[name="gender"]')
    .closest('.form-group')
    .querySelector('.error-message'),
  password: inputs.password
    .closest('.form-group')
    .querySelector('.error-message'),
  confirmPassword: inputs.confirmPassword
    .closest('.form-group')
    .querySelector('.error-message'),
  formError: signupForm.lastElementChild,
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

// Validation Functions
const validateName = (name) => /^[a-zA-Z]{3,20}$/.test(name);
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validatePassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

const clearErrors = () => {
  Object.values(errors).forEach((error) => {
    error.classList.remove('show');
    error.textContent = ''; // Clear any previous error messages
  });

  Object.values(inputs).forEach((input) => {
    input.classList?.remove('error');
  });
};

// Form Submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors(); // Clear previous errors before validation

  const selectedGender = Array.from(inputs.gender).find(
    (radio) => radio.checked
  )?.value;

  // Validate inputs
  const validationResults = {
    fName: inputs.fName.value ? validateName(inputs.fName.value) : null,
    lName: inputs.lName.value ? validateName(inputs.lName.value) : null,
    email: inputs.email.value ? validateEmail(inputs.email.value) : null,
    password: inputs.password.value
      ? validatePassword(inputs.password.value)
      : null,
    confirmPassword: inputs.confirmPassword.value
      ? inputs.password.value === inputs.confirmPassword.value
      : null,
    gender: selectedGender ? true : null,
  };

  // Display validation errors
  Object.keys(validationResults).forEach((key) => {
    if (validationResults[key] === null) {
      errors[key].textContent = errorMessages[key].required;
    } else if (validationResults[key] === false) {
      errors[key].textContent = errorMessages[key].invalid;
    }

    if (validationResults[key] === null || validationResults[key] === false) {
      errors[key].classList.add('show');
      if (key === 'gender') {
        inputs.gender.forEach((radio) =>
          radio.closest('label').classList.add('error')
        );
      } else {
        inputs[key].classList.add('error');
      }
    }
  });

  // Proceed if all validations pass
  if (Object.values(validationResults).every(Boolean)) {
    try {
      const users = await fetchUsers();
      const isExistingUser = users.some(
        (user) => user.email === inputs.email.value
      );

      if (isExistingUser) {
        errors.formError.textContent =
          'This email already exists. Please try logging in.';
        errors.formError.classList.add('show');
      } else {
        const newUser = {
          id: users.length + 1,
          fname: inputs.fName.value,
          lname: inputs.lName.value,
          gender: selectedGender,
          email: inputs.email.value,
          password: inputs.password.value,
          exams: [
            { examId: 101, status: 'pending', score: null },
            { examId: 102, status: 'pending', score: null },
            { examId: 201, status: 'pending', score: null },
          ],
        };
        goToLogin();
        setTimeout(async () => {
          await createUser(newUser);
        }, 500);
        localStorage.setItem(
          'user',
          JSON.stringify({
            firstName: inputs.fName.value,
            lastName: inputs.lName.value,
            id: newUser.id,
            gender: selectedGender,
          })
        );
      }
    } catch (error) {
      console.error('Error during sign-up process:', error);
      errors.formError.textContent =
        'An error occurred. Please try again later.';
    }
  }
});
