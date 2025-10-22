// Controla a index.html
const container = document.getElementById('cursos-container');
const searchBar = document.getElementById('search-bar');
const noResults = document.getElementById('no-results');

function getWatchedLessons() {
  const watched = localStorage.getItem('watchedLessons');
  return watched ? JSON.parse(watched) : {};
}

// 1. Separa a lógica de renderização em uma função
function renderCursos(cursosParaRenderizar) {
  container.innerHTML = ''; // Limpa os cursos atuais
  const watchedLessons = getWatchedLessons();

  if (cursosParaRenderizar.length === 0) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
  }

  cursosParaRenderizar.forEach(curso => {
    const watchedArray = watchedLessons[curso.id] || [];
    const completed = watchedArray.length;
    const total = curso.totalAulas || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${curso.thumbnail}" alt="${curso.titulo}">
      <h3>${curso.titulo}</h3>
      <p>${curso.descricao}</p>
      
      <div class="progress-info">
        <span>${percent}% Concluído</span>
        <span>${completed} / ${total} aulas</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percent}%;"></div>
      </div>
      <button>Acessar Curso</button>
    `;
    
    card.addEventListener('click', () => {
      location.href = `course.html?id=${curso.id}`;
    });
    container.appendChild(card);
  });
}

// 2. Lógica da Barra de Pesquisa
searchBar?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCursos = cursos.filter(curso => {
    return curso.titulo.toLowerCase().includes(searchTerm) || 
           curso.descricao.toLowerCase().includes(searchTerm);
  });
  renderCursos(filteredCursos);
});

// 3. Renderização inicial
if (container) {
  renderCursos(cursos);
}