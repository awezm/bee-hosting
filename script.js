const grid=document.getElementById('project-grid');const search=document.getElementById('search');let allProjects=[];
async function loadProjects(){try{const res=await fetch('data/projects.json',{cache:'no-store'});if(!res.ok)throw new Error('Failed to load projects.json');allProjects=await res.json();render(allProjects);}catch(e){grid.innerHTML=`<article class="project-card"><div class="project-title">Error</div><div class="project-desc">${e.message}</div></article>`;}}
function render(list){if(!list.length){grid.innerHTML=`<article class="project-card"><div class="project-desc">No projects match your search.</div></article>`;return;}
grid.innerHTML=list.map(p=>`
<article class="project-card">
  <div class="project-head">
    ${p.icon?`<img src="${p.icon}" alt="">`:favicon(p.url)}
    <div class="project-title">${escapeHtml(p.name)}</div>
  </div>
  <div class="project-desc">${escapeHtml(p.description||'')}</div>
  ${Array.isArray(p.tags)?`<div class="project-tags">${p.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`:''}
  <div class="card-actions">
    ${p.url?`<a class="btn-link" href="${p.url}" target="_blank" rel="noopener">Open</a>`:''}
    ${p.repo?`<a class="btn-link" href="${p.repo}" target="_blank" rel="noopener">Repo</a>`:''}
    ${p.docs?`<a class="btn-link" href="${p.docs}" target="_blank" rel="noopener">Docs</a>`:''}
  </div>
</article>`).join('');}
function favicon(url){try{const host=new URL(url).hostname;return `<img src="https://www.google.com/s2/favicons?domain=${host}&sz=64" alt="">`;}catch{return `<img src="" alt="">`;}}
function escapeHtml(s){return (s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
search?.addEventListener('input',e=>{const q=(e.target.value||'').toLowerCase();const filtered=allProjects.filter(p=>[p.name,p.description,...(p.tags||[])].join(' ').toLowerCase().includes(q));render(filtered);});
loadProjects();
