// Controla a course.html
const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

// 1. Encontra o curso no "data.js"
const cursoInfo = cursos.find(c => c.id === courseId);

const titleEl = document.getElementById('course-title');
const descEl = document.getElementById('course-description');
const modulosContainer = document.getElementById('modulos-container');

// Elementos da Barra de Progresso
const progressInfo = document.getElementById('course-progress-info');
const progressBar = document.getElementById('course-progress-bar');
const progressPercent = document.getElementById('progress-percent');
const progressCount = document.getElementById('progress-count');
const progressBarInner = document.getElementById('progress-bar-inner');

function getWatchedLessons() {
  const watched = localStorage.getItem('watchedLessons');
  return watched ? JSON.parse(watched) : {};
}

if (cursoInfo && titleEl && modulosContainer) {
  // 2. Preenche o cabeçalho imediatamente
  titleEl.textContent = cursoInfo.titulo;
  descEl.textContent = cursoInfo.descricao;
  document.title = cursoInfo.titulo;

  // 3. Carrega o script de dados do curso
  loadCourseData(courseId);

} else {
  location.href = 'index.html'; 
}

function loadCourseData(id) {
  const script = document.createElement('script');
  script.src = `cursos/${id}.js`; // Ex: cursos/curso-intensivo.js
  document.body.appendChild(script);

  // 4. QUANDO o script carregar...
  script.onload = function() {
    
    // Pega o progresso salvo
    const watchedLessons = getWatchedLessons();
    const watchedArray = watchedLessons[id] || [];
    const completed = watchedArray.length;
    const total = cursoInfo.totalAulas || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 5. Atualiza a Barra de Progresso do Cabeçalho
    progressPercent.textContent = `${percent}% Concluído`;
    progressCount.textContent = `${completed} / ${total} aulas`;
    progressBarInner.style.width = `${percent}%`;
    progressInfo.style.display = 'flex'; // Mostra os elementos
    progressBar.style.display = 'block'; // Mostra os elementos

    // 6. LIMPA os skeletons
    modulosContainer.innerHTML = '';

    // 7. Lista os módulos reais
    cursoData.modulos.forEach((modulo, index) => {
      const item = document.createElement('div');
      item.className = 'module-item';
      
      if (watchedArray.includes(index)) {
        item.classList.add('watched');
      }

      item.innerHTML = `<span>${modulo.titulo}</span>`;
      
      item.addEventListener('click', () => {
        location.href = `aula.html?courseId=${id}&aulaId=${index}`;
      });
      modulosContainer.appendChild(item);
    });
  };

  script.onerror = function() {
    modulosContainer.innerHTML = "<p>Erro ao carregar os módulos do curso. Verifique o nome do arquivo em /cursos/</p>";
  };
}