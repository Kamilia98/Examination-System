document.getElementById('signupForm').addEventListener('submit', (e) => {
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
    localStorage.setItem(
      'user',
      JSON.stringify({
        firstName: fNameInput.value,
        lastName: lNameInput.value,
      })
    );
    location.href = 'home.html?userId=1';
  }
});
