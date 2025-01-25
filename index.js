const user = JSON.parse(localStorage.getItem('user'));
location.href = user
  ? `pages/Home/home.html?userId=${user.id}`
  : 'pages/Registration/registration.html';
