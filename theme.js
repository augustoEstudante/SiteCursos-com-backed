// IIFE (Immediately Invoked Function Expression) para rodar o código imediatamente
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Função para aplicar o tema salvo
  function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  // 1. Aplica o tema assim que a página carrega
  applyTheme();

  // 2. Adiciona o evento de clique ao botão
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    // 3. Salva a nova escolha no localStorage
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
})();