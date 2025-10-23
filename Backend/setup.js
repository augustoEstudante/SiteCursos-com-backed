const openDb = require('./database');

// 1. DADOS ATUAIS (copiados dos seus arquivos .js)
// --------------------------------------------------

// De: Site cursos/data.js
const cursosBase = [
  {
    id: "matematica-basica",
    titulo: "Matemática Básica",
    descricao: "Aprenda os fundamentos da matemática...",
    thumbnail: "IMAGES_CURSOS/matematica.jpg"
  },
  {
    id: "portugues-concursos",
    titulo: "Português para Concursos",
    descricao: "Domine a gramática...",
    thumbnail: "IMAGES_CURSOS/portugues.png"
  },
  {
    id: "curso-intensivo",
    titulo: "Curso Intensivo (Universo Narrado)",
    descricao: "Curso de matematica do universo narrado",
    thumbnail: "IMAGES_CURSOS/CURSO1.jpg"
  }
];

// De: Site cursos/cursos/curso-intensivo.js
const cursoIntensivoData = {
  titulo: "Desvendando a Matemática - Felipe Guisoli",
  modulos: [
    {
      titulo: "Módulo 0: Introdução",
      aulas: [
        { titulo: "00-01 - Seja bem vindo!", url: "https://filemoon.sx/e/icye3mrcvcvk", materiais: null }
      ]
    },
    {
      titulo: "Módulo 1: Fundamentos",
      aulas: [
        { titulo: "01-01 - As regras do jogo", url: "https://filemoon.sx/e/r1aemkud5ugq", materiais: null },
        { titulo: "01-02 - Papiro de Rhind e a Matemática do Egito Antigo", url: "https://filemoon.sx/e/9v9il9sv3ace", materiais: null },
        // ... (Vou omitir o resto das aulas por brevidade, mas você deve colar TUDO)
        { titulo: "01-07 - Resolução de Exercício (o último do problema das torneiras)", url: "https://filemoon.sx/e/c37tejys2u5n", materiais: null }
      ]
    },
     {
      titulo: "Módulo 9: Funções",
      aulas: [
        { titulo: "9 - Aula 01 Intuição O que são Funções", url: "https://filemoon.sx/e/je21j6hqnr6l", materiais: null },
        { titulo: "9 - Aula 21 Função do Segundo Grau Máximo e Mínimo (Exemplo)", url: "https://filemoon.sx/e/hddmxlt75fib", materiais: null }
      ]
    },
    {
      titulo: "Módulo 10: Conclusão",
      aulas: [
        { titulo: "10-01 - Obrigado e até a próxima!", url: "https://filemoon.sx/e/d6uours8jjjf", materiais: null }
      ]
    }
  ]
};
// (Certifique-se de colar TODOS os módulos e aulas de 'curso-intensivo.js' acima)
// --------------------------------------------------


// 2. FUNÇÃO DE SETUP
// --------------------------------------------------
async function setupDatabase() {
  const db = await openDb();
  console.log('Conexão com o banco de dados estabelecida.');

  // Habilita chaves estrangeiras
  await db.exec('PRAGMA foreign_keys = ON;');

  console.log('Criando tabelas...');
  // Cria as tabelas (IF NOT EXISTS previne erro se já existirem)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cursos (
      id TEXT PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      thumbnail TEXT
    );

    CREATE TABLE IF NOT EXISTS modulos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      curso_id TEXT NOT NULL,
      titulo TEXT NOT NULL,
      ordem INTEGER,
      FOREIGN KEY (curso_id) REFERENCES cursos (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS aulas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      modulo_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      url_video TEXT,
      materiais TEXT,
      ordem INTEGER,
      FOREIGN KEY (modulo_id) REFERENCES modulos (id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS progresso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      aula_id_global INTEGER NOT NULL, 
      course_id TEXT NOT NULL,
      assistido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
      UNIQUE(usuario_id, aula_id_global, course_id)
    );
  `);
  console.log('Tabelas criadas com sucesso.');

  // 3. INSERINDO OS DADOS
  // --------------------------------------------------
  console.log('Inserindo dados mestre (cursos)...');
  try {
    // Usando 'run' para inserir um por um
    for (const curso of cursosBase) {
      await db.run(
        'INSERT OR IGNORE INTO cursos (id, titulo, descricao, thumbnail) VALUES (?, ?, ?, ?)',
        curso.id,
        curso.titulo,
        curso.descricao,
        curso.thumbnail
      );
    }
    console.log('Cursos base inseridos.');

    // Inserindo o curso-intensivo (e seus módulos/aulas)
    console.log('Inserindo dados do curso intensivo...');
    const cursoId = 'curso-intensivo';
    let moduloOrdem = 0;
    
    for (const modulo of cursoIntensivoData.modulos) {
      // Insere o módulo e pega o ID dele
      const result = await db.run(
        'INSERT INTO modulos (curso_id, titulo, ordem) VALUES (?, ?, ?)',
        cursoId,
        modulo.titulo,
        moduloOrdem
      );
      const moduloId = result.lastID; // Pega o ID do módulo que acabou de ser criado
      moduloOrdem++;

      let aulaOrdem = 0;
      if (modulo.aulas && modulo.aulas.length > 0) {
        for (const aula of modulo.aulas) {
          // Insere a aula referenciando o moduloId
          await db.run(
            'INSERT INTO aulas (modulo_id, titulo, url_video, materiais, ordem) VALUES (?, ?, ?, ?, ?)',
            moduloId,
            aula.titulo,
            aula.url,
            aula.materiais,
            aulaOrdem
          );
          aulaOrdem++;
        }
      }
    }
    console.log('Módulos e aulas do curso intensivo inseridos.');

  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT') {
      console.log('Os dados principais (cursos) já foram inseridos anteriormente.');
    } else {
      console.error('Erro ao inserir dados:', e.message);
    }
  }
  
  // (Aqui você adicionaria a inserção dos outros cursos, 'matematica-basica', etc.)
  
  console.log('-------------------------------------------');
  console.log('Configuração do banco de dados concluída!');
  console.log('-------------------------------------------');
  await db.close();
}

// Roda a função
setupDatabase();