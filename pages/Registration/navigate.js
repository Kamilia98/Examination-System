document.getElementById('goToLogin').addEventListener('click', goToLogin);
document.getElementById('goToSignup').addEventListener('click', goToSignup);

function adjustLayout() {
  const swapper = document.querySelector('.swapper');
  const signup = document.querySelector('.signup');
  const login = document.querySelector('.login');

  if (window.innerWidth <= 1200) {
    // No Swapper mode
    swapper.style.left = '';
    swapper.style.right = '';
    if (login.classList.contains('active')) {
      signup.style.display = 'none';
    }
    if (signup.classList.contains('active')) {
      login.style.display = 'none';
    }
  } else {
    // Switch to Swapper mode
    login.style.display = 'flex';
    signup.style.display = 'flex';

    swapper.style.animation = '';

    swapper.style.left = login.classList.contains('active') ? '' : '0';
    swapper.style.right = login.classList.contains('active') ? '0' : '';
  }
}

export function goToLogin() {
  const swapper = document.querySelector('.swapper');
  const signup = document.querySelector('.signup');
  const login = document.querySelector('.login');
  login.classList.add('active');
  signup.classList.remove('active');
  if (window.innerWidth <= 1200) {
    // No swapper Mode
    signup.style.display = 'none';
    login.style.display = 'flex';
  } else {
    // Swapper Mode
    swapper.style.right = '';
    swapper.style.left = '';
    swapper.style.animation = 'slideInFromLeft 0.5s ease-out forwards';
  }
}

function goToSignup() {
  const swapper = document.querySelector('.swapper');
  const signup = document.querySelector('.signup');
  const login = document.querySelector('.login');
  signup.classList.add('active');
  login.classList.remove('active');
  if (window.innerWidth <= 1200) {
    // No swapper Mode
    login.style.display = 'none';
    signup.style.display = 'flex';
  } else {
    // Swapper Mode
    swapper.style.right = '';
    swapper.style.left = '';
    swapper.style.animation = 'slideInFromRight 0.5s ease-out forwards';
  }
}

window.addEventListener('resize', adjustLayout);
adjustLayout();
