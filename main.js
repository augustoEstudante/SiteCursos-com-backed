// Controla a index.html
const container = document.getElementById('cursos-container');

if (container) {
  cursos.forEach(curso => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${curso.thumbnail}" alt="${curso.titulo}">
      <h3>${curso.titulo}</h3>
      <p>${curso.descricao}</p>
      <button>Acessar Curso</button>
    `;
    // Adiciona o clique para a nova página de curso
    card.addEventListener('click', () => {
      location.href = `course.html?id=${curso.id}`;
    });
    container.appendChild(card);
  });
}