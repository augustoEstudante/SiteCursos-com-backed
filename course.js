// Controla a course.html
const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

// 1. Encontra o curso no "data.js" (que já foi carregado)
const cursoInfo = cursos.find(c => c.id === courseId);

const titleEl = document.getElementById('course-title');
const descEl = document.getElementById('course-description');
const modulosContainer = document.getElementById('modulos-container');

// --- NOVO: Helper para pegar aulas assistidas ---
function getWatchedLessons() {
  const watched = localStorage.getItem('watchedLessons');
  return watched ? JSON.parse(watched) : {};
}
// ----------------------------------------------

if (cursoInfo && titleEl && modulosContainer) {
  // 2. Preenche o cabeçalho com as infos do "data.js"
  titleEl.textContent = cursoInfo.titulo;
  descEl.textContent = cursoInfo.descricao;
  document.title = cursoInfo.titulo;

  // 3. Função para carregar dinamicamente o script da pasta /cursos/
  loadCourseData(courseId);

} else {
  location.href = 'index.html'; // Curso não encontrado
}

function loadCourseData(id) {
  const script = document.createElement('script');
  script.src = `cursos/${id}.js`; // Ex: cursos/curso-intensivo.js
  document.body.appendChild(script);

  // 4. QUANDO o script carregar, a variável "cursoData" existirá
  script.onload = function() {
    
    // --- NOVO: Pega o progresso salvo ---
    const watchedLessons = getWatchedLessons();
    const watchedArray = watchedLessons[id] || []; // Pega o array desse curso
    // ------------------------------------

    // 5. Agora podemos usar a variável "cursoData" para listar os módulos
    cursoData.modulos.forEach((modulo, index) => {
      const item = document.createElement('div');
      item.className = 'module-item';
      
      // --- NOVO: Verifica se a aula foi assistida ---
      if (watchedArray.includes(index)) {
        item.classList.add('watched');
      }
      // ----------------------------------------------

      item.innerHTML = `<span>${modulo.titulo}</span>`;
      
      item.addEventListener('click', () => {
        location.href = `aula.html?courseId=${id}&aulaId=${index}`;
      });
      modulosContainer.appendChild(item);
    });
  };

  script.onerror = function() {
    modulosContainer.innerHTML = "<p>Erro ao carregar os módulos do curso.</p>";
  };
}