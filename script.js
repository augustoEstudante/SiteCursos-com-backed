// Tema
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Index
const container = document.getElementById('cursos');
if(container){
  cursos.forEach((curso,i)=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${curso.thumbnail}" alt="${curso.titulo}">
      <h3>${curso.titulo}</h3>
      <p>${curso.descricao}</p>
      <button onclick="location.href='curso.html?id=${i}'">Assistir</button>
    `;
    container.appendChild(card);
  });
}

// Curso
const params = new URLSearchParams(window.location.search);
let id = parseInt(params.get('id')||0);
const tituloEl = document.getElementById('titulo');
const iframeEl = document.getElementById('video');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const sidebar = document.getElementById('sidebar');

function carregarCurso(i){
  tituloEl.textContent = cursos[i].titulo;
  iframeEl.src = cursos[i].url;
  sidebar.innerHTML = '';
  cursos.forEach((c, idx)=>{
    const div = document.createElement('div');
    div.textContent = `${idx+1}. ${c.titulo}`;
    if(idx===i) div.classList.add('active');
    div.addEventListener('click', ()=>{ id=idx; carregarCurso(idx); });
    sidebar.appendChild(div);
  });
}

if(tituloEl) carregarCurso(id);

prevBtn?.addEventListener('click', ()=>{
  if(id>0) { id--; carregarCurso(id); }
});
nextBtn?.addEventListener('click', ()=>{
  if(id<cursos.length-1){ id++; carregarCurso(id); }
});
backBtn?.addEventListener('click', ()=> location.href='index.html');
