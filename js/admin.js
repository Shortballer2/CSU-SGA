let token = localStorage.getItem('token');
let contentData = null;

async function apiLogin(username, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  token = data.token;
  localStorage.setItem('token', token);
}

async function loadContent() {
  const res = await fetch('/api/content');
  contentData = await res.json();
}

function createEntry(container, item, fields) {
  const div = document.createElement('div');
  fields.forEach(f => {
    const input = document.createElement('input');
    input.placeholder = f.charAt(0).toUpperCase() + f.slice(1);
    input.value = item[f] || '';
    input.addEventListener('input', e => {
      item[f] = e.target.value;
    });
    div.appendChild(input);
  });
  container.appendChild(div);
}

function renderSection(containerId, items, fields) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => createEntry(container, item, fields));
}

function renderAll() {
  renderSection('executives-form', contentData.personnel.executives, ['name', 'role']);
  renderSection('cabinet-form', contentData.personnel.cabinet, ['name', 'role']);
  renderSection('senators-form', contentData.personnel.senators, ['name', 'role']);
  renderSection('events-form', contentData.events, ['date', 'title']);
  renderSection('media-form', contentData.media, ['url']);
}

async function saveContent() {
  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(contentData)
  });
  if (res.ok) {
    alert('Saved');
  } else {
    alert('Save failed');
  }
}

function addHandlers() {
  document.getElementById('add-executive').addEventListener('click', () => {
    contentData.personnel.executives.push({ name: '', role: '' });
    renderAll();
  });
  document.getElementById('add-cabinet').addEventListener('click', () => {
    contentData.personnel.cabinet.push({ name: '', role: '' });
    renderAll();
  });
  document.getElementById('add-senator').addEventListener('click', () => {
    contentData.personnel.senators.push({ name: '', role: '' });
    renderAll();
  });
  document.getElementById('add-event').addEventListener('click', () => {
    contentData.events.push({ date: '', title: '' });
    renderAll();
  });
  document.getElementById('add-media').addEventListener('click', () => {
    contentData.media.push({ url: '' });
    renderAll();
  });
  document.getElementById('save-btn').addEventListener('click', saveContent);
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('login-btn').addEventListener('click', async e => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    try {
      await apiLogin(u, p);
      await loadContent();
      document.getElementById('login').style.display = 'none';
      document.getElementById('editor').style.display = 'block';
      renderAll();
      addHandlers();
    } catch (err) {
      alert('Login failed');
    }
  });

  if (token) {
    await loadContent();
    document.getElementById('login').style.display = 'none';
    document.getElementById('editor').style.display = 'block';
    renderAll();
    addHandlers();
  }
});
