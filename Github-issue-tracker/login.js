document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim(); 
  const password = document.getElementById('password').value.trim();  

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }
  if (username === 'admin' && password === 'admin123') {
    window.location.href = 'main_page.html';  
  } else {
    alert('Invalid credentials. Please try again.');
  }
});