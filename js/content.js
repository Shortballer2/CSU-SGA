document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/content');
  const data = await res.json();

  if (document.getElementById('executives-list')) {
    renderMembers('executives-list', data.personnel.executives);
    renderMembers('cabinet-list', data.personnel.cabinet);
    renderMembers('senators-list', data.personnel.senators);
  }

  if (document.getElementById('events-list')) {
    renderEvents('events-list', data.events);
  }

  if (document.getElementById('media-list')) {
    renderMedia('media-list', data.media);
  }
});

function renderMembers(id, members) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  members.forEach(m => {
    const div = document.createElement('div');
    div.className = 'member-card';
    div.textContent = `${m.name} - ${m.role}`;
    container.appendChild(div);
  });
}

function renderEvents(id, events) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  events.forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.date}: ${e.title}`;
    container.appendChild(li);
  });
}

function renderMedia(id, media) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  media.forEach(m => {
    const ext = m.url.split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(ext)) {
      const video = document.createElement('video');
      video.src = m.url;
      video.controls = true;
      container.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = m.url;
      img.alt = '';
      container.appendChild(img);
    }
  });
}
