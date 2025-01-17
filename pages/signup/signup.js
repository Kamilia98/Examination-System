import { fetchUsers } from '../../db/Apis/GET.js';

// Get the count of users
async function getUsersCount() {
  const users = await fetchUsers();
  return users ? users.length : 0;
}

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fNameInput = document.getElementById('fNameInput');
  const lNameInput = document.getElementById('lNameInput');

  const fNameError = fNameInput
    .closest('.form-input')
    .querySelector('.error-message');
  const lNameError = lNameInput
    .closest('.form-input')
    .querySelector('.error-message');

  fNameError.textContent = '';
  lNameError.textContent = '';

  function validateName(param) {
    return /^[a-zA-Z]+$/.test(param) && param.length >= 3 && param.length <= 20;
  }

  if (!validateName(fNameInput.value)) {
    fNameError.textContent =
      'First name must be between 3 and 20 characters and contain only letters.';
  }
  if (!validateName(lNameInput.value)) {
    lNameError.textContent =
      'Last name must be between 3 and 20 characters and contain only letters.';
  }

  if (validateName(fNameInput.value) && validateName(lNameInput.value)) {
    try {
      const usersCount = await getUsersCount();
      console.log(`Total users: ${usersCount}`);

      localStorage.setItem(
        'user',
        JSON.stringify({
          firstName: fNameInput.value,
          lastName: lNameInput.value,
        })
      );
      // Redirect to Home page
      // location.href = '../Home/home.html?userId=1';
    } catch (error) {
      console.error('Error during user validation:', error);
    }
  }
});
