(function () {

  // Route guard for dashboard
  if (location.pathname.endsWith('dashboard.html')) {
    var isAuth = localStorage.getItem('auth') === 'true';
    if (!isAuth) {
      location.replace('login.html');
      return;
    }
    var email = localStorage.getItem('email') || '';
    var userEmail = document.getElementById('userEmail');
    var greetingEmail = document.getElementById('greetingEmail');
    if (userEmail) userEmail.textContent = email;
    if (greetingEmail) greetingEmail.textContent = email ? ', ' + email : '';
  }

  // Logout
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('auth');
      localStorage.removeItem('email');
      location.replace('index.html');
    });
  }

  // Login form
  var loginForm = document.getElementById('loginForm');
  var loginBtn = document.getElementById('loginBtn');
  var alertBox = document.getElementById('alertBox');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var emailEl = document.getElementById('email');
      var passEl = document.getElementById('password');
      var email = emailEl && 'value' in emailEl ? emailEl.value.trim() : '';
      var password = passEl && 'value' in passEl ? passEl.value.trim() : '';

      if (!email) { if (emailEl) emailEl.classList.add('is-invalid'); return; }
      if (!password) { if (passEl) passEl.classList.add('is-invalid'); return; }

      var token = '';
      if (window.hcaptcha && typeof window.hcaptcha.getResponse === 'function') {
        token = window.hcaptcha.getResponse();
      }
      if (!token) {
        showError('Please solve the hCaptcha challenge first.');
        return;
      }

      try {
        var res = await fetch((window.API_BASE || '') + '/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password, hcaptchaToken: token })
        });
        var data = await res.json();
        if (!res.ok || !data.success) {
          showError(data.message || 'Login failed.');
          if (window.hcaptcha && typeof window.hcaptcha.reset === 'function') window.hcaptcha.reset();
          if (loginBtn) loginBtn.setAttribute('disabled', 'true');
          return;
        }

        localStorage.setItem('auth', 'true');
        localStorage.setItem('email', email);
        location.replace('dashboard.html');
      } catch (err) {
        showError('Network error. Please try again.');
      }
    });

    ['email','password'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.classList.remove('is-invalid'); });
    });
  }

  // hCaptcha callbacks
  window.onCaptchaSuccess = function () {
    var btn = document.getElementById('loginBtn');
    if (btn) btn.removeAttribute('disabled');
  };
  window.onCaptchaExpired = function () {
    var btn = document.getElementById('loginBtn');
    if (btn) btn.setAttribute('disabled', 'true');
  };

  function showError(msg) {
    if (alertBox) {
      alertBox.classList.remove('d-none');
      alertBox.textContent = msg;
    } else {
      alert(msg);
    }
  }
})();
