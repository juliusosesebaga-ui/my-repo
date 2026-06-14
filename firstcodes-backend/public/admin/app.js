const API = window.location.origin.replace('/admin','') + '/api';
let adminToken = null;

async function fetchJSON(url, opts={}){
  opts.headers = opts.headers || {};
  if (!opts.headers['Content-Type']) opts.headers['Content-Type'] = 'application/json';
  if (adminToken) opts.headers['x-admin-token'] = adminToken;
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// SERMONS
async function loadSermons(){
  const items = await fetchJSON(API + '/sermons');
  const el = document.getElementById('sermons-list');
  el.innerHTML = '';
  items.forEach(s => {
    const d = document.createElement('div'); d.className='card';
    const imgHtml = s.images && s.images.length ? `<img src="${s.images[0]}" alt="${s.title}" style="max-width:150px;display:block;margin-bottom:8px">` : '';
    const adHtml = s.ad ? `<div class="ad">${s.ad}</div>` : '';
    d.innerHTML = `${imgHtml}<h3>${s.title}</h3><small>by ${s.author||'N/A'}</small><p>${(s.body||'').slice(0,200)}</p>${adHtml}<div class="row"><button onclick="editSermon(${s.id})">Edit</button><button onclick="deleteSermon(${s.id})">Delete</button></div>`;
    el.appendChild(d);
  });
}

async function createSermon(){
  const title = document.getElementById('sermon-title').value;
  const slug = document.getElementById('sermon-slug').value;
  const author = document.getElementById('sermon-author').value;
  const body = document.getElementById('sermon-body').value;
  const images = document.getElementById('sermon-images').value;
  const ad = document.getElementById('sermon-ad').value;
  if (!title || !body) {
    alert('Title and body are required.');
    return;
  }
  await fetchJSON(API + '/sermons', { method: 'POST', body: JSON.stringify({ title, slug, author, body, images, ad }) });
  loadSermons();
}

window.createSermon = createSermon;

async function deleteSermon(id){
  if (!confirm('Delete sermon?')) return;
  await fetchJSON(API + '/sermons/' + id, { method: 'DELETE' });
  loadSermons();
}
window.deleteSermon = deleteSermon;

async function editSermon(id){
  const s = await fetchJSON(API + '/sermons/' + id);
  const title = prompt('Title', s.title);
  if (title==null) return;
  const body = prompt('Body', s.body);
  await fetchJSON(API + '/sermons/' + id, { method: 'PUT', body: JSON.stringify({ title, slug: s.slug, author: s.author, body }) });
  loadSermons();
}
window.editSermon = editSermon;

// ANNOUNCEMENTS
async function loadAnns(){
  const items = await fetchJSON(API + '/announcements');
  const el = document.getElementById('anns-list');
  el.innerHTML = '';
  items.forEach(a => {
    const d = document.createElement('div'); d.className='card';
    const imgHtml = a.images && a.images.length ? `<img src="${a.images[0]}" alt="${a.title}" style="max-width:150px;display:block;margin-bottom:8px">` : '';
    const addrHtml = a.address ? `<p><strong>Address:</strong> ${a.address}</p>` : '';
    const checklistHtml = a.checklist && a.checklist.length ? `<ul>${a.checklist.map(i=>`<li>${i}</li>`).join('')}</ul>` : '';
    const adHtml = a.ad ? `<div class="ad">${a.ad}</div>` : '';
    d.innerHTML = `${imgHtml}<h3>${a.title}</h3><p>${(a.content||'').slice(0,200)}</p>${addrHtml}${checklistHtml}${adHtml}<div class="row"><button onclick="deleteAnn(${a.id})">Delete</button><button onclick="editAnn(${a.id})">Edit</button></div>`;
    el.appendChild(d);
  });
}

async function createAnn(){
  const title = document.getElementById('ann-title').value;
  const content = document.getElementById('ann-content').value;
  const address = document.getElementById('ann-address').value;
  const checklist = document.getElementById('ann-checklist').value;
  const images = document.getElementById('ann-images').value;
  const ad = document.getElementById('ann-ad').value;
  const active = document.getElementById('ann-active').checked;
  if (!title || !content) {
    alert('Title and content are required.');
    return;
  }
  await fetchJSON(API + '/announcements', { method: 'POST', body: JSON.stringify({ title, content, active, address, checklist, images, ad }) });
  loadAnns();
}
window.createAnn = createAnn;

async function deleteAnn(id){
  if (!confirm('Delete announcement?')) return;
  await fetchJSON(API + '/announcements/' + id, { method: 'DELETE' });
  loadAnns();
}
window.deleteAnn = deleteAnn;

async function editAnn(id){
  const a = await fetchJSON(API + '/announcements/' + id);
  const title = prompt('Title', a.title);
  if (title==null) return;
  const content = prompt('Content', a.content);
  await fetchJSON(API + '/announcements/' + id, { method: 'PUT', body: JSON.stringify({ title, content, active: a.active }) });
  loadAnns();
}
window.editAnn = editAnn;

async function loginAdmin(){
  const username = document.getElementById('admin-user').value;
  const password = document.getElementById('admin-pass').value;
  const errorEl = document.getElementById('login-error');
  try {
    const data = await fetchJSON(API + '/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    adminToken = data.token;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('content-section').style.display = 'block';
    errorEl.style.display = 'none';
    loadSermons();
    loadAnns();
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.style.display = 'block';
  }
}

document.getElementById('login-button').addEventListener('click', loginAdmin);
document.getElementById('create-sermon').addEventListener('click', createSermon);
document.getElementById('create-ann').addEventListener('click', createAnn);
