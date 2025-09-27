const groupsEl = document.getElementById('groups');
const search = document.getElementById('search');
const catBar = document.getElementById('cat-bar');

let allProjects = [];
let activeCategory = 'All';

async function loadProjects() {
  try {
    const res = await fetch('data/projects.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load projects.json');
    allProjects = await res.json();
    buildCategoryBar(allProjects);
    applyFilters();
  } catch (e) {
    groupsEl.innerHTML = `<article class="project-card"><div class="project-title">Error</div><div class="project-desc">${e.message}</div></article>`;
  }
}

function buildCategoryBar(items) {
  const cats = Array.from(new Set(items.map(p => p.category || 'Uncategorized'))).sort();
  const pills = ['All', ...cats];
  catBar.innerHTML = pills.map(c => `
    <button class="cat-pill ${c===activeCategory?'active':''}" data-cat="${c}">${c}</button>
  `).join('');

  catBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-pill');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    [...catBar.querySelectorAll('.cat-pill')].forEach(b => b.classList.toggle('active', b===btn));
    applyFilters();
  });
}

function applyFilters() {
  const q = (search?.value || '').toLowerCase();
  let list = allProjects;

  // category filter
  if (activeCategory !== 'All') {
    list = list.filter(p => (p.category || 'Uncategorized') === activeCategory);
  }

  // text search
  if (q) {
    list = list.filter(p =>
      [p.name, p.description, p.category, ...(p.tags||[])].join(' ').toLowerCase().includes(q)
    );
  }

  renderGrouped(list);
}

function renderGrouped(list) {
  if (!list.length) {
    groupsEl.innerHTML = `<div class="project-card"><div class="project-desc">No projects match.</div></div>`;
    return;
  }

  // group by category
  const byCat = {};
  for (const p of list) {
    const c = p.category || 'Uncategorized';
    (byCat[c] ||= []).push(p);
  }

  // sort categories: Live, In Dev, Experimenting, then A-Z
  const order = { 'Live': 0, 'In Dev': 1, 'Experimenting': 2 };
  const cats = Object.keys(byCat).sort((a,b) => {
    const ra = a in order ? order[a] : 100;
    const rb = b in order ? order[b] : 100;
    return ra - rb || a.localeCompare(b);
  });

  groupsEl.innerHTML = cats.map(cat => `
    <section class="group" aria-label="${cat}">
      <h3>${cat}</h3>
      <div class="grid">
        ${byCat[cat].map(cardHtml).join('')}
      </div>
    </section>
  `).join('');
}

function cardHtml(p) {
  return `
  <article class="project-card">
    <div class="project-head">
      ${p.icon ? `<img src="${p.icon}" alt="">` : favicon(p.url)}
      <div class="project-title">${escapeHtml(p.name)}</div>
    </div>
    <div class="project-desc">${escapeHtml(p.description || '')}</div>
    ${Array.isArray(p.tags) ? `<div class="project-tags">${p.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    <div class="card-actions">
      ${p.url ? `<a class="btn-link" href="${p.url}" target="_blank" rel="noopener">Open</a>` : ''}
      ${p.repo ? `<a class="btn-link" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
      ${p.docs ? `<a class="btn-link" href="${p.docs}" target="_blank" rel="noopener">Docs</a>` : ''}
    </div>
  </article>`;
}

function favicon(url) {
  try {
    const host = new URL(url).hostname;
    return `<img src="https://www.google.com/s2/favicons?domain=${host}&sz=64" alt="">`;
  } catch { return `<img src="" alt="">`; }
}
function escapeHtml(s){ return (s??'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

search?.addEventListener('input', applyFilters);
loadProjects();
