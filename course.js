// Controla a course.html
const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

const cursoInfo = cursos.find(c => c.id === courseId); // Info do data.js

const titleEl = document.getElementById('course-title');
const descEl = document.getElementById('course-description');
const modulosContainer = document.getElementById('modulos-container');
// ... (outros elementos como antes) ...
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
  titleEl.textContent = cursoInfo.titulo;
  descEl.textContent = cursoInfo.descricao;
  document.title = cursoInfo.titulo;
  loadCourseData(courseId);
} else {
  location.href = 'index.html'; 
}

function loadCourseData(id) {
  const script = document.createElement('script');
  script.src = `cursos/${id}.js`;
  document.body.appendChild(script);

  script.onload = function() {
    if (typeof cursoData === 'undefined') {
        modulosContainer.innerHTML = "<p>Erro: Estrutura de dados do curso inválida.</p>";
        return;
    }

    const totalAulas = cursoData.modulos.reduce((acc, modulo) => acc + (modulo.aulas ? modulo.aulas.length : 0), 0);
    cursoInfo.totalAulas = totalAulas;

    const watchedLessons = getWatchedLessons();
    const watchedArray = watchedLessons[id] || [];
    const completed = watchedArray.length;
    const percent = totalAulas > 0 ? Math.round((completed / totalAulas) * 100) : 0;

    // Atualiza barra de progresso
    progressPercent.textContent = `${percent}% Concluído`;
    progressCount.textContent = `${completed} / ${totalAulas} aulas`;
    progressBarInner.style.width = `${percent}%`;
    progressInfo.style.display = 'flex';
    progressBar.style.display = 'block';

    modulosContainer.innerHTML = ''; // Limpa skeletons

    let globalLessonCounter = 0; 

    cursoData.modulos.forEach((modulo) => { 
      // *** TÍTULO DO MÓDULO REMOVIDO (conforme solicitado) ***

      // Verifica se 'aulas' existe e é um array
      if (modulo.aulas && Array.isArray(modulo.aulas)) {
          modulo.aulas.forEach((aula) => { 
            const currentGlobalIndex = globalLessonCounter; 
            const item = document.createElement('div');
            item.className = 'module-item';
            
            if (watchedArray.includes(currentGlobalIndex)) { 
              item.classList.add('watched');
            }

            const span = document.createElement('span');
            span.textContent = aula.titulo || 'Aula sem título';
            item.appendChild(span);
            
            item.addEventListener('click', () => {
              location.href = `aula.html?courseId=${id}&aulaId=${currentGlobalIndex}`; 
            });
            modulosContainer.appendChild(item);
            globalLessonCounter++; 
          });
      } else {
           console.warn(`Módulo "${modulo.titulo || '(sem título)'}" não tem um array 'aulas' válido.`);
      }
    });
  };

  script.onerror = function() {
    modulosContainer.innerHTML = `<p>Erro ao carregar o arquivo: cursos/${id}.js</p>`;
  };
}