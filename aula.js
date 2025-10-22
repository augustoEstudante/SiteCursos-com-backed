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
    const modulos = cursoData.modulos;

    // Adiciona o listener ao botão "Assistir"
    watchToggleBtn?.addEventListener('click', toggleWatchStatus);

    // 3. Função para carregar a aula (agora dentro do .onload)
    function carregarAula(index) {
      if (index < 0 || index >= modulos.length) return; 

      const aula = modulos[index];
      aulaId = index; 

      tituloEl.innerHTML = `<span id="watched-check"></span> ${aula.titulo}`; // Recria o título
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

      // Atualiza a sidebar
      updateSidebar(modulos);
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
      if (aulaId < modulos.length - 1) carregarAula(aulaId + 1);
    });

    backBtn?.addEventListener('click', () => {
      location.href = `course.html?id=${id}`;
    });

  }; // Fim do script.onload

  script.onerror = function() {
    tituloEl.textContent = "Erro ao carregar dados do curso.";
  };
}

// NOVO: Atualiza a Sidebar (para mostrar "assistido" e "ativo")
function updateSidebar(modulos) {
  const watchedLessons = getWatchedLessons();
  const watchedArray = watchedLessons[courseId] || [];

  sidebar.innerHTML = `<h3>Aulas de ${cursoData.titulo}</h3>`;
  modulos.forEach((m, idx) => {
    const div = document.createElement('div');
    div.textContent = `${idx + 1}. ${m.titulo}`;
    
    // Adiciona classe se for assistido
    if (watchedArray.includes(idx)) {
      div.classList.add('watched');
    }
    // Adiciona classe se for a aula ATIVA
    if (idx === aulaId) {
      div.classList.add('active');
    }
    
    div.addEventListener('click', () => {
      // Re-chama a função de carregar aula, que está no escopo superior
      // (Precisa de uma refatoração melhor, mas isso funciona por agora)
      location.search = `courseId=${courseId}&aulaId=${idx}`; 
    });
    sidebar.appendChild(div);
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
  updateSidebar(cursoData.modulos);
}