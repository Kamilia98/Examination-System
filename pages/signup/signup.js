import * as gets from '../../db/Apis/GET.js';
import { createUser } from '../../db/Apis/POST.JS';

// Get the count of users
async function getUsers() {
  const users = await gets.fetchUsers();
  return users;
}

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fNameInput = document.getElementById('fNameInput');
  const lNameInput = document.getElementById('lNameInput');
  const emailInput = document.getElementById('emailInput');

  const fNameError = fNameInput
    .closest('.form-input')
    .querySelector('.error-message');
  const lNameError = lNameInput
    .closest('.form-input')
    .querySelector('.error-message');
  const emailError = emailInput
    .closest('.form-input')
    .querySelector('.error-message');

  fNameError.textContent = '';
  fNameError.textContent = '';
  emailError.textContent = '';

  function validateName(param) {
    return /^[a-zA-Z]+$/.test(param) && param.length >= 3 && param.length <= 20;
  }
  function validateEmail(param) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(param);
  }

  if (!validateName(fNameInput.value)) {
    fNameError.textContent =
      'First name must be between 3 and 20 characters and contain only letters.';
  }
  if (!validateName(lNameInput.value)) {
    lNameError.textContent =
      'Last name must be between 3 and 20 characters and contain only letters.';
  }

  if (!validateEmail(emailInput.value)) {
    emailError.textContent = 'Email should be email.';
  }

  if (
    validateName(fNameInput.value) &&
    validateName(lNameInput.value) &&
    validateEmail(emailInput.value)
  ) {
    try {
      const users = await getUsers();
      const usersCount = users.length;
      if (users.some((user) => user.email == emailInput.value)) {
        Toastify({
          text: 'You already a member!',
          duration: 1000,
          gravity: 'top',
          position: 'center',
          backgroundColor: 'green',
        }).showToast();

        setTimeout(() => {
          window.location.href = '../Login/login.html';
        }, 1000);
      } else {
        const newId = usersCount + 1;
        const user = {
          id: newId,
          fname: fNameInput.value,
          lname: lNameInput.value,
          email: emailInput.value,
          exams: [
            {
              examId: 101,
              status: 'pending',
              score: null,
            },
            {
              examId: 102,
              status: 'pending',
              score: null,
            },
            {
              examId: 201,
              status: 'pending',
              score: null,
            },
          ],
        };
        createUser(user);

        localStorage.setItem(
          'user',
          JSON.stringify({
            firstName: fNameInput.value,
            lastName: lNameInput.value,
          })
        );
        location.href = `../Home/home.html?userId=${newId}`;
      }
    } catch (error) {
      console.error('Error during user validation:', error);
    }
  }
});
