import { fetchUsers } from '../../db/Apis/GET.js';
import { createUser } from '../../db/Apis/POST.js';

const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const inputs = {
    fName: document.getElementById('fNameInput'),
    lName: document.getElementById('lNameInput'),
    email: document.getElementById('emailInput'),
    password: document.getElementById('passwordInput'),
    confirmPassword: document.getElementById('confirmPasswordInput'),
  };

  const errors = {
    fName: inputs.fName.closest('.form-input').querySelector('.error-message'),
    lName: inputs.lName.closest('.form-input').querySelector('.error-message'),
    email: inputs.email.closest('.form-input').querySelector('.error-message'),
    password: inputs.password
      .closest('.form-input')
      .querySelector('.error-message'),
    confirmPassword: inputs.confirmPassword
      .closest('.form-input')
      .querySelector('.error-message'),
  };

  // Clear previous error messages
  Object.values(errors).forEach((error) => (error.textContent = ''));

  // Validation functions
  const validateName = (name) => /^[a-zA-Z]{3,20}$/.test(name);
  const validateEmail = (email) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);

  const validationResults = {
    fName: validateName(inputs.fName.value),
    lName: validateName(inputs.lName.value),
    email: validateEmail(inputs.email.value),
    password: validatePassword(inputs.password.value),
    confirmPassword: inputs.password.value === inputs.confirmPassword.value,
  };

  // Display validation errors
  if (!validationResults.fName) {
    errors.fName.textContent =
      'First name must be 3-20 characters and only letters.';
  }
  if (!validationResults.lName) {
    errors.lName.textContent =
      'Last name must be 3-20 characters and only letters.';
  }
  if (!validationResults.email) {
    errors.email.textContent = 'Invalid email format.';
  }
  if (!validationResults.password) {
    errors.password.textContent =
      'Password must be at least 8 characters, include a number, an uppercase, and a lowercase letter.';
  }
  if (!validationResults.confirmPassword) {
    errors.confirmPassword.textContent = 'Passwords do not match.';
  }

  // Proceed only if all validations pass
  if (Object.values(validationResults).every(Boolean)) {
    try {
      const users = await fetchUsers();
      const isExistingUser = users.some(
        (user) => user.email === inputs.email.value
      );

      if (isExistingUser) {
        // User already signed up so redirect to login
        Toastify({
          text: 'You are already a member!',
          duration: 1000,
          gravity: 'top',
          position: 'center',
          backgroundColor: 'green',
        }).showToast();

        setTimeout(() => {
          window.location.href = '../Login/login.html';
        }, 1000);
      } else {
        // Create new user
        const newUser = {
          id: users.length + 1,
          fname: inputs.fName.value,
          lname: inputs.lName.value,
          email: inputs.email.value,
          password: inputs.password.value,
          exams: [
            { examId: 101, status: 'pending', score: null },
            { examId: 102, status: 'pending', score: null },
            { examId: 201, status: 'pending', score: null },
          ],
        };
        // POST to db
        await createUser(newUser);
        // Add to LocalStorage to indicate Logged in user
        localStorage.setItem(
          'user',
          JSON.stringify({ firstName: inputs.fName.value, id: newUser.id })
        );
        //Redirect to home passing the userId
        window.location.href = `../Home/home.html?userId=${newUser.id}`;
      }
    } catch (error) {
      console.error('Error during sign-up process:', error);
    }
  }
});
