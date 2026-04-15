const EMAIL_DOMAIN = '@student.csuniv.edu';

function normalizeLocalPart(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function suggestedLocalPart(name) {
  const parts = String(name || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return '';

  const firstInitial = parts[0][0] || '';
  const lastName = parts[parts.length - 1] || '';
  const middleInitials = parts.slice(1, -1).map(part => part[0]).join('');
  return `${firstInitial}${middleInitials}${lastName}`.replace(/[^a-z0-9]/g, '');
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('vote-form');
  const nameInput = document.getElementById('voter-name');
  const localInput = document.getElementById('voter-email-local');
  const message = document.getElementById('vote-message');

  nameInput.addEventListener('blur', () => {
    if (localInput.value.trim()) return;
    const suggested = suggestedLocalPart(nameInput.value);
    if (suggested) {
      localInput.value = suggested;
    }
  });

  localInput.addEventListener('input', () => {
    localInput.value = normalizeLocalPart(localInput.value);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const localPart = normalizeLocalPart(localInput.value);

    if (!name || !localPart) {
      message.textContent = 'Please provide both name and email.';
      return;
    }

    const email = `${localPart}${EMAIL_DOMAIN}`;

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.error || 'Unable to submit vote.';
      return;
    }

    message.textContent = 'Vote submitted and verified successfully.';
    form.reset();
  });
});
