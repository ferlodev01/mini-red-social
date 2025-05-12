// public/script.js
const API       = '/posts';
const viewNew   = document.getElementById('view-new');
const viewList  = document.getElementById('view-list');
const btnNew    = document.getElementById('btn-new');
const btnList   = document.getElementById('btn-list');
const form      = document.getElementById('form-post');
const errorDiv  = document.getElementById('error');
const postsUl   = document.getElementById('posts');
const nameEl    = document.getElementById('name');
const messageEl = document.getElementById('message');
const pwEl      = document.getElementById('password');
const notif     = document.getElementById('notification');

// Mostrar/ocultar vistas
btnNew.addEventListener('click', () => {
  viewNew.style.display  = 'block';
  viewList.style.display = 'none';
});
btnList.addEventListener('click', () => {
  viewNew.style.display  = 'none';
  viewList.style.display = 'block';
  loadPosts();
});

// Utilidades de notificaciones y errores
function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 3000);
}
function showNotification(msg) {
  notif.textContent = msg;
  notif.classList.remove('hidden');
  notif.classList.add('show');
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.classList.add('hidden'), 300);
  }, 2000);
}

// Envío de nuevo post
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = nameEl.value.trim();
  const message = messageEl.value.trim();
  const password= pwEl.value;
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message, password })
    });
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error);
    }
    form.reset();
    btnList.click();
  } catch (err) {
    showError(err.message);
  }
});

// Pedir contraseña en modal
function askPassword() {
  return new Promise(resolve => {
    const modal = document.getElementById('pwd-modal');
    const input = document.getElementById('pwd-input');
    const okBtn = document.getElementById('pwd-confirm');
    const noBtn = document.getElementById('pwd-cancel');
    input.value = '';
    modal.classList.remove('hidden');

    function cleanup(ans) {
      modal.classList.add('hidden');
      okBtn.removeEventListener('click', onOk);
      noBtn.removeEventListener('click', onNo);
      resolve(ans === 'ok' ? input.value : null);
    }
    function onOk () { cleanup('ok'); }
    function onNo () { cleanup('cancel'); }

    okBtn.addEventListener('click', onOk);
    noBtn.addEventListener('click', onNo);
  });
}

// Eliminar post con contraseña
async function interactDelete(id) {
  const pw = await askPassword();
  if (!pw) return;
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ password: pw })
  });
  if (res.status === 204) {
    showNotification('Post eliminado correctamente');
    loadPosts();
  } else {
    const { error } = await res.json();
    showError(error);
  }
}

// Like / Dislike toggle
async function interact(id, action) {
  const url = action === 'like'
    ? `${API}/${id}/like`
    : `${API}/${id}/dislike`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) {
    showError('Operación falló');
    return;
  }
  loadPosts();
}

// Cargar y renderizar posts
async function loadPosts() {
  postsUl.innerHTML = '';
  const res   = await fetch(API);
  const posts = await res.json();

  posts.forEach(p => {
    const li  = document.createElement('li');
    const date= new Date(p.createdAt);
    const time= date.toLocaleString();

    li.innerHTML = `
      <div class="post">
        <div class="post-header">
          <span class="post-author">${p.name}</span>
          <span class="post-time">${time}</span>
        </div>
        <p class="post-message">${p.message}</p>
        <div class="post-actions">
          <button class="like"    data-id="${p.id}">${p.likes} ❤️</button>
          <button class="dislike" data-id="${p.id}">${p.dislikes} 💔</button>
          <button class="delete"  data-id="${p.id}">Eliminar</button>
        </div>
      </div>
    `;
    postsUl.appendChild(li);
  });

  // Asignar eventos a botones
  document.querySelectorAll('.like').forEach(btn =>
    btn.addEventListener('click', () => interact(btn.dataset.id, 'like'))
  );
  document.querySelectorAll('.dislike').forEach(btn =>
    btn.addEventListener('click', () => interact(btn.dataset.id, 'dislike'))
  );
  document.querySelectorAll('.delete').forEach(btn =>
    btn.addEventListener('click', () => interactDelete(btn.dataset.id))
  );
}

// Inicializar
btnList.click();
