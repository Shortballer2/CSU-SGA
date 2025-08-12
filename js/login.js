document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('login-modal');
  const openBtn = document.getElementById('admin-login-btn');
  const closeBtn = document.getElementById('close-login');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  document.getElementById('login-submit').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      modal.style.display = 'none';
      window.location.href = '/admin.html';
    } catch (e) {
      alert('Login failed');
    }
  });
});
