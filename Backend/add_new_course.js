// Este é um script reutilizável para adicionar NOVOS cursos.
// Para usar:
// 1. Configure as seções 1 e 2 abaixo.
// 2. Pare o servidor (Ctrl+C)
// 3. Rode no terminal: node add_new_course.js
// 4. Inicie o servidor novamente: node server.js

const openDb = require('./database');

// --- 1. CONFIGURE SEU NOVO CURSO AQUI ---
const novoCurso = {
  // --- CORREÇÃO 1: ID simplificado ---
  id: "matematica-universo-narrado",
  titulo: "Curso de Matemática (Universo Narrado)",
  descricao: "Curso de matemática basica do universo narrado, materias na primeira aula ",
  thumbnail: "IMAGES_CURSOS/devendando-a-matematica.jpg",
  // --- CORREÇÃO 2: Adicionado moduloUnico ---
  moduloUnico: "Aulas de Matemática" // Nome do módulo que agrupará as aulas
};

// --- 2. COLE A LISTA DE AULAS AQUI ---
const novasAulas = [
  { titulo: "Seja bem vindo!", url: "https://filemoon.sx/e/icye3mrcvcvk" },
  { titulo: "As regras do jogo", url: "https://filemoon.sx/e/r1aemkud5ugq" },
  { titulo: "Papiro de Rhind e a Matemática do Egito Antigo", url: "https://filemoon.sx/e/9v9il9sv3ace" },
  { titulo: "Frações (soma e subtração)", url: "https://filemoon.sx/e/u8whj636opq7" },
  { titulo: "Frações (multiplicação e divisão)", url: "https://filemoon.sx/e/18fcyip0sv2e" },
  { titulo: "Aplicação Simples - ENEM", url: "https://filemoon.sx/e/e8kafjphotth" },
  { titulo: "Aprofundamento - O Problema das Torneiras", url: "https://filemoon.sx/e/i50f99lyxal0" },
  { titulo: "Resolução de Exercício (o último do problema das torneiras)", url: "https://filemoon.sx/e/c37tejys2u5n" },
  { titulo: "Números Decimais - Soma e Subtração", url: "https://filemoon.sx/e/omvsyrg5oz3t" },
  { titulo: "Números Decimais - Multiplicação e Divisão", url: "https://filemoon.sx/e/6snai2axa21z" },
  { titulo: "Porcentagem - Uma linguagem diferente", url: "https://filemoon.sx/e/6f9f9ui02kgt" },
  { titulo: "Os axiomas Soma e Subtração", url: "https://filemoon.sx/e/oysyq0mm07zt" },
  { titulo: "Os axiomas Multiplicação e Divisão", url: "https://filemoon.sx/e/cfttjdacf92e" },
  { titulo: "Aplicando as regras (multiplicar por 1 e menos vezes mais)", url: "https://filemoon.sx/e/6c5a6j4keldf" },
  { titulo: "Fatoração 01", url: "https://filemoon.sx/e/tgyhlr2edt2i" },
  { titulo: "Fatoração 02 Produtos Notáveis", url: "https://filemoon.sx/e/8d8en15lhlqh" },
  { titulo: "Fatoração 03 Produtos Notáveis (continuação)", url: "https://filemoon.sx/e/evp8yxi3nplz" },
  { titulo: "Exercício Resolvido (n_10 da lista)", url: "https://filemoon.sx/e/yblsjwu4rs87" },
  { titulo: "Propriedades de potenciação", url: "https://filemoon.sx/e/u6d0lep7g2s5" },
  { titulo: "Elevando a zero", url: "https://filemoon.sx/e/ikn0eo4pk5tf" },
  { titulo: "Elevar a expoente negativo", url: "https://filemoon.sx/e/xjcf2o2185o9" },
  { titulo: "O que é uma raiz quadrada", url: "https://filemoon.sx/e/4ozd0wq4txvb" },
  { titulo: "Aplicação conversão de unidades", url: "https://filemoon.sx/e/4r3e54ydj6py" },
  { titulo: "Grandezas compostas", url: "https://filemoon.sx/e/55psadse0lpl" },
  { titulo: "Equações do primeiro grau e sistemas", url: "https://filemoon.sx/e/n1vq063kt9qt" },
  { titulo: "Um pouco mais de sistemas", url: "https://filemoon.sx/e/2kr2ylo1ucuy" },
  { titulo: "Equação do segundo grau", url: "https://filemoon.sx/e/dxyoqg0moq40" },
  { titulo: "Outras equações (irracionais)", url: "https://filemoon.sx/e/uu6k9a874iih" },
  { titulo: "Exemplo 02", url: "https://filemoon.sx/e/zupox0paqwe5" },
  { titulo: "Discussão sobre criar raízes em uma equação", url: "https://filemoon.sx/e/27yb1v5xhyov" },
  { titulo: "Exemplo 03", url: "https://filemoon.sx/e/55b3qxr8stx2" },
  { titulo: "Os postulados da Geometria Plana", url: "https://filemoon.sx/e/gsa9xoj04ru9" },
  { titulo: "Congruência de Triângulos", url: "https://filemoon.sx/e/qa0b9bpg4iev" },
  { titulo: "Semelhança de Triângulos", url: "https://filemoon.sx/e/xt8dfuls6rdv" },
  { titulo: "Paralelismo e Ângulos Internos de um Triângulo", url: "https://filemoon.sx/e/xg5ox6kuyjvw" },
  { titulo: "Exemplo 01", url: "https://filemoon.sx/e/5s1si68jxo41" },
  { titulo: "Exemplo 02", url: "https://filemoon.sx/e/dr1lofikmh18" },
  { titulo: "Exemplo 03", url: "https://filemoon.sx/e/xjgrr6nx0onx" },
  { titulo: "Exemplo 03 - Complemento", url: "https://filemoon.sx/e/gant85ux388h" },
  { titulo: "Teorema de Pitágoras", url: "https://filemoon.sx/e/vfip3tv207km" },
  { titulo: "Triângulos Pitagóricos", url: "https://filemoon.sx/e/87f0ig2e44tw" },
  { titulo: "Triângulo Isósceles e Ângulos Internos", url: "https://filemoon.sx/e/udl578ibg10r" },
  { titulo: "As funções trigonométricas no triângulo Retângulo", url: "https://filemoon.sx/e/12cm59oera4f" },
  { titulo: "Exemplos", url: "https://filemoon.sx/e/nwpiw2ohaif6" },
  { titulo: "Arcos Notáveis", url: "https://filemoon.sx/e/j0ceausjrm8g" },
  { titulo: "Qual é o motivo do triângulo ser retângulo", url: "https://filemoon.sx/e/nsjuztnpko42" },
  { titulo: "Trigonometria com ângulos estranhos", url: "https://filemoon.sx/e/v7bdfpy7x1qu" },
  { titulo: "Ciclo trigonométrico", url: "https://filemoon.sx/e/8y48wedrgbfl" },
  { titulo: "Ciclo trigonométrico Tangente", url: "https://filemoon.sx/e/64fampth3hjc" },
  { titulo: "Relação Fundamental da Trigonometria", url: "https://filemoon.sx/e/2ix89xlbt6bw" },
  { titulo: "Da onde vem a regra de 3 Proporção direta", url: "https://filemoon.sx/e/99eqs9onfckw" },
  { titulo: "Exemplos de proporção direta e regra de 3", url: "https://filemoon.sx/e/s7lsdnmvcuuo" },
  { titulo: "Proporção Inversa", url: "https://filemoon.sx/e/dqwp2kgmvmeq" },
  { titulo: "Outras Proporcionalidades", url: "https://filemoon.sx/e/ljzvglp1dr7e" },
  { titulo: "Resolução - Questão 07 da lista", url: "https://filemoon.sx/e/xkuwnlx5yir8" },
  { titulo: "A regra dos sinais para a multiplicação", url: "https://filemoon.sx/e/j5yjjhs8jhqs" },
  { titulo: "O problema da divisão por zero", url: "https://filemoon.sx/e/7litywo00dw7" },
  { titulo: "Um é igual a dois! Respeite as regras do jogo!", url: "https://filemoon.sx/e/siim6j8q97nt" },
  { titulo: "Intuição O que são Funções", url: "https://filemoon.sx/e/je21j6hqnr6l" },
  { titulo: "Domínio e Imagem", url: "https://filemoon.sx/e/6lo8tm9gl66y" },
  { titulo: "Exemplo", url: "https://filemoon.sx/e/8hollcs9roza" },
  { titulo: "Função Definição", url: "https://filemoon.sx/e/o2p56nqiv07c" },
  { titulo: "Exemplo", url: "https://filemoon.sx/e/g8vtv5phqqaf" },
  { titulo: "Função Crescente e Função Decrescente", url: "https://filemoon.sx/e/rw7sh6ynu229" },
  { titulo: "Raiz ou Zero de uma Função", url: "https://filemoon.sx/e/6qgoy4ls3uys" },
  { titulo: "Função Constante", url: "https://filemoon.sx/e/vrtzx2wjpqdc" },
  { titulo: "Função do Primeiro Grau", url: "https://filemoon.sx/e/iatk88fowam0" },
  { titulo: "Função do Primeiro Grau Coeficiente Linear", url: "https://filemoon.sx/e/srteesl2ulhb" },
  { titulo: "Função do Primeiro Grau Coeficiente Angular", url: "https://filemoon.sx/e/tktptgs0jbul" },
  { titulo: "Função do Primeiro Grau Raiz e Sinais", url: "https://filemoon.sx/e/s7ne9fcfok9m" },
  { titulo: "Função do Primeiro Grau Igualdade de Funções", url: "https://filemoon.sx/e/h9wj88i9vxrf" },
  { titulo: "Função do Primeiro Grau Exercício", url: "https://filemoon.sx/e/jx9iadamrxkc" },
  { titulo: "Função do Segundo Grau Definição e Gráfico", url: "https://filemoon.sx/e/ge840fktlcg8" },
  { titulo: "Função do Segundo Grau Concavidade da Parábola", url: "https://filemoon.sx/e/2uzkipehrawg" },
  { titulo: "Função do Segundo Grau Raízes e Interpretação Geométrica", url: "https://filemoon.sx/e/z7dabaozv8ct" },
  { titulo: "Função do Segundo Grau Termo Independente", url: "https://filemoon.sx/e/kak5z3fuplzf" },
  { titulo: "Função do Segundo Grau Construção de Gráficos", url: "https://filemoon.sx/e/5eamfw1fatef" },
  { titulo: "Função do Segundo Grau Máximo e Mínimo (Coordenadas do Vértice)", url: "https://filemoon.sx/e/ip15o9arwnkd" },
  { titulo: "Função do Segundo Grau Máximo e Mínimo (Exemplo)", url: "https://filemoon.sx/e/hddmxlt75fib" },
  { titulo: "Obrigado e até a próxima!", url: "https://filemoon.sx/e/d6uours8jjjf" }
];


// --- 3. SCRIPT (Não precisa editar daqui para baixo) ---
(async () => {
  if (novasAulas.length === 0 || !novoCurso.id || !novoCurso.moduloUnico) { // Verifica se moduloUnico existe
    console.error('ERRO: Configure as seções 1 (incluindo id e moduloUnico) e 2 do script antes de rodar.');
    return;
  }

  const db = await openDb();
  console.log(`Iniciando adição do curso: ${novoCurso.titulo} (ID: ${novoCurso.id})`);

  try {
    // Insere o curso (ou ignora se o ID já existe)
    await db.run(
      'INSERT OR IGNORE INTO cursos (id, titulo, descricao, thumbnail) VALUES (?, ?, ?, ?)',
      novoCurso.id,
      novoCurso.titulo,
      novoCurso.descricao,
      novoCurso.thumbnail
    );
    // Verifica se o curso foi realmente inserido ou se já existia
    const cursoExistente = await db.get('SELECT id FROM cursos WHERE id = ?', novoCurso.id);
    if (!cursoExistente) {
        console.error(`ERRO: Falha ao inserir curso com ID "${novoCurso.id}". Verifique os dados.`);
        await db.close();
        return;
    }
    console.log(`Curso "${novoCurso.titulo}" pronto na tabela 'cursos'.`);

    // Tenta criar o Módulo Único (ou ignora se já existe para este curso)
    await db.run(
      'INSERT OR IGNORE INTO modulos (curso_id, titulo, ordem) VALUES (?, ?, ?)',
      novoCurso.id,
      novoCurso.moduloUnico,
      0
    );

    // Pega o ID do módulo (seja ele novo ou existente)
    const modulo = await db.get('SELECT id FROM modulos WHERE curso_id = ? AND titulo = ?', novoCurso.id, novoCurso.moduloUnico);
    if (!modulo) {
        console.error(`ERRO: Falha ao encontrar ou criar o módulo "${novoCurso.moduloUnico}" para o curso ID "${novoCurso.id}".`);
        await db.close();
        return;
    }
    const moduloId = modulo.id;
    console.log(`Módulo "${novoCurso.moduloUnico}" pronto (ID: ${moduloId}).`);

    // Insere as aulas (ou ignora se uma aula com mesmo título já existe NESSE módulo)
    let aulasInseridas = 0;
    let aulaOrdem = 0; // Começa a ordem do zero
    for (const aula of novasAulas) {
      // Usamos INSERT OR IGNORE para evitar duplicatas baseadas no modulo_id e titulo
      // (Você pode querer uma chave única mais robusta, como modulo_id + url_video)
      const result = await db.run(
        'INSERT OR IGNORE INTO aulas (modulo_id, titulo, url_video, materiais, ordem) VALUES (?, ?, ?, ?, ?)',
        moduloId,
        aula.titulo,
        aula.url,
        aula.materiais || null,
        aulaOrdem // Usa a ordem sequencial
      );
      if (result.changes > 0) { // Verifica se uma linha foi realmente inserida
          aulasInseridas++;
      }
      aulaOrdem++; // Incrementa a ordem para a próxima aula
    }
    console.log(`${aulasInseridas} novas aulas inseridas no módulo (aulas duplicadas foram ignoradas).`);
    console.log('-------------------------------------------');
    console.log('Adição/Atualização do curso concluída!');
    console.log('-------------------------------------------');

  } catch (e) {
     // Erro genérico (Constraint de chave estrangeira, etc.)
     console.error('Erro durante a operação no banco de dados:', e.message);
  }

  await db.close();
})();