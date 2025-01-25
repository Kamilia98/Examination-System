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

    if (login.classList.contains('active')) {
      swapper.style.right = '0';
      swapper.style.left = '';
    }
    if (signup.classList.contains('active')) {
      swapper.style.left = '0';
      swapper.style.right = '';
    }
  }
}

export function goToLogin() {
  const swapper = document.querySelector('.swapper');
  const signup = document.querySelector('.signup');
  const login = document.querySelector('.login');
  if (window.innerWidth <= 1200) {
    // No swapper Mode
    signup.style.display = 'none';
    signup.classList.remove('active');
    login.style.display = 'flex';
    login.classList.add('active');
  } else {
    // Swapper Mode
    swapper.style.right = '';
    swapper.style.left = '';
    swapper.style.animation = 'slideInFromLeft 0.5s ease-out forwards';
    login.classList.add('active');
    signup.classList.remove('active');
  }
}

function goToSignup() {
  const swapper = document.querySelector('.swapper');
  const signup = document.querySelector('.signup');
  const login = document.querySelector('.login');
  if (window.innerWidth <= 1200) {
    // No swapper Mode
    login.style.display = 'none';
    login.classList.remove('active');
    signup.style.display = 'flex';
    signup.classList.add('active');
  } else {
    // Swapper Mode
    swapper.style.right = '';
    swapper.style.left = '';
    swapper.style.animation = 'slideInFromRight 0.5s ease-out forwards';
    signup.classList.add('active');
    login.classList.remove('active');
  }
}

window.addEventListener('resize', adjustLayout);
adjustLayout();
