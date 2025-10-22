// Controla a index.html
const container = document.getElementById('cursos-container');

// Helper para pegar o progresso salvo
function getWatchedLessons() {
  const watched = localStorage.getItem('watchedLessons');
  return watched ? JSON.parse(watched) : {};
}

if (container) {
  const watchedLessons = getWatchedLessons();

  cursos.forEach(curso => {
    // Pega o progresso para *este* curso
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