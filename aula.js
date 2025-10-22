// Controla a aula.html (player)
const params = new URLSearchParams(window.location.search);
const courseId = params.get('courseId');
let aulaId = parseInt(params.get('aulaId') || 0);

if (!courseId) {
  location.href = 'index.html'; // Segurança
}

// Elementos da página
const tituloEl = document.getElementById('titulo');
const iframeEl = document.getElementById('video');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const sidebar = document.getElementById('sidebar');
const materialLink = document.getElementById('material-link');
const watchToggleBtn = document.getElementById('watch-toggle'); // Novo botão
const watchedCheckEl = document.getElementById('watched-check'); // Novo ícone no título

// --- Variáveis Globais para Aulas ---
let allLessons = [];
let totalAulas = 0;
// ------------------------------------


// --- NOVAS FUNÇÕES DE "AULA ASSISTIDA" ---

// Pega o objeto de progresso do localStorage
function getWatchedLessons() {
  const watched = localStorage.getItem('watchedLessons');
  return watched ? JSON.parse(watched) : {};
}

// Salva o objeto de progresso no localStorage
function saveWatchedLessons(watchedObject) {
  localStorage.setItem('watchedLessons', JSON.stringify(watchedObject));
}

// Verifica se a aula atual está marcada como assistida
function isCurrentLessonWatched() {
  const watchedLessons = getWatchedLessons();
  const watchedArray = watchedLessons[courseId] || [];
  return watchedArray.includes(aulaId);
}

// Alterna o status (assitido / não assistido) da aula ATUAL
function toggleWatchStatus() {
  const watchedLessons = getWatchedLessons();
  if (!watchedLessons[courseId]) {
    watchedLessons[courseId] = []; // Cria o array para este curso se não existir
  }
  
  const watchedArray = watchedLessons[courseId];
  const lessonIndex = watchedArray.indexOf(aulaId);

  if (lessonIndex > -1) {
    // Já assistiu -> Marcar como NÃO assistida
    watchedArray.splice(lessonIndex, 1);
  } else {
    // Não assistiu -> Marcar como ASSISTIDA
    watchedArray.push(aulaId);
  }
  
  saveWatchedLessons(watchedLessons); // Salva a mudança
  updateWatchUI(); // Atualiza a interface
}
// ------------------------------------------

// 1. Carrega dinamicamente os dados do curso da pasta /cursos/
loadAndDisplayCourse(courseId, aulaId);

function loadAndDisplayCourse(id, initialAulaId) {
  const script = document.createElement('script');
  script.src = `cursos/${id}.js`; // Ex: cursos/curso-intensivo.js
  document.body.appendChild(script);

  script.onload = function() {
    // *** CORREÇÃO: Junta todas as aulas de todos os módulos em um único array ***
    allLessons = cursoData.modulos.reduce((acc, modulo) => {
        if (modulo.aulas && Array.isArray(modulo.aulas)) {
            return acc.concat(modulo.aulas);
        }
        return acc;
    }, []);
    totalAulas = allLessons.length;
    // **************************************************************************

    // Adiciona o listener ao botão "Assistir"
    watchToggleBtn?.addEventListener('click', toggleWatchStatus);

    // 3. Função para carregar a aula (agora dentro do .onload)
    function carregarAula(index) {
      // Usa o 'totalAulas' corrigido
      if (index < 0 || index >= totalAulas) return; 

      const aula = allLessons[index]; // Pega a aula do array 'allLessons'
      aulaId = index; 

      tituloEl.innerHTML = '';
      const watchedCheck = document.createElement('span');
      watchedCheck.id = 'watched-check';
      tituloEl.appendChild(watchedCheck);
      tituloEl.appendChild(document.createTextNode(aula.titulo));

      iframeEl.src = aula.url;
      document.title = aula.titulo;

      if (aula.materiais) {
        materialLink.href = aula.materiais;
        materialLink.textContent = "Baixar Material";
        materialLink.style.display = 'inline-block';
      } else {
        materialLink.textContent = "Material indisponível";
        materialLink.href = "#";
      }

      // Atualiza a sidebar (passando o array 'allLessons')
      updateSidebar(allLessons);
      // Atualiza o botão e o ícone de "assistido"
      updateWatchUI();
      
      window.history.pushState(null, '', `aula.html?courseId=${id}&aulaId=${aulaId}`);
    }

    // 4. Carrega a aula inicial
    carregarAula(initialAulaId);

    // 5. Configura os botões de navegação
    prevBtn?.addEventListener('click', () => {
      if (aulaId > 0) carregarAula(aulaId - 1);
    });

    nextBtn?.addEventListener('click', () => {
      // *** MUDANÇA: Marca como assistida ANTES de ir para a próxima ***
      if (!isCurrentLessonWatched()) {
        toggleWatchStatus();
      }
      // ***************************************************************

      if (aulaId < totalAulas - 1) { // Usa 'totalAulas' corrigido
          carregarAula(aulaId + 1);
      }
    });

    backBtn?.addEventListener('click', () => {
      location.href = `course.html?id=${id}`;
    });

  }; // Fim do script.onload

  script.onerror = function() {
    tituloEl.textContent = "Erro ao carregar dados do curso.";
  };
}

// NOVO: Atualiza a Sidebar (para mostrar apenas aulas relevantes)
function updateSidebar(lessons) { // 'lessons' é o array 'allLessons'
  const watchedLessons = getWatchedLessons();
  const watchedArray = watchedLessons[courseId] || [];

  sidebar.innerHTML = '';
  const h3 = document.createElement('h3');
  h3.textContent = cursoData.titulo || "Aulas"; 
  sidebar.appendChild(h3);

  // "A aula anterior que fica em cima a aula atual e a próxima aula as duas próximas aulas."
  const indicesToShow = [aulaId - 1, aulaId, aulaId + 1, aulaId + 2];

  indicesToShow.forEach((idx) => {
    // Verifica se o índice é válido
    if (idx >= 0 && idx < lessons.length) {
      const aula = lessons[idx];
      const div = document.createElement('div');
      
      // Adiciona label de status
      let label = "";
      if (idx === aulaId - 1) {
        label = "Anterior: ";
      } else if (idx === aulaId) {
        label = "Atual: ";
      } else if (idx === aulaId + 1) {
        label = "Próxima: ";
      } else if (idx === aulaId + 2) {
        label = "Seguinte: ";
      }

      div.textContent = `${label}${aula.titulo}`;
      
      // Adiciona classe se for assistido
      if (watchedArray.includes(idx)) {
        div.classList.add('watched');
      }
      // Adiciona classe se for a aula ATIVA
      if (idx === aulaId) {
        div.classList.add('active');
      }
      
      div.addEventListener('click', () => {
        // Recarrega a página com o novo aulaId
        location.search = `courseId=${courseId}&aulaId=${idx}`; 
      });
      sidebar.appendChild(div);
    }
  });
}

// NOVO: Atualiza o botão e o ícone de "assistido"
function updateWatchUI() {
  const watched = isCurrentLessonWatched();
  const checkIcon = document.getElementById('watched-check'); // Pega o ícone do título

  if (watched) {
    watchToggleBtn.textContent = 'Desmarcar aula';
    watchToggleBtn.classList.add('watched');
    if (checkIcon) checkIcon.textContent = '✔'; // Adiciona o check no título
  } else {
    watchToggleBtn.textContent = 'Marcar como Assistida';
    watchToggleBtn.classList.remove('watched');
    if (checkIcon) checkIcon.textContent = ''; // Remove o check
  }

  // Atualiza a sidebar para refletir a mudança
  // (Passa o array 'allLessons' que é global)
  if(allLessons.length > 0) {
    updateSidebar(allLessons);
  }
}