const express = require('express');
const cors = require('cors'); // Para permitir que seu frontend acesse o backend
const openDb = require('./database');

const app = express();
const port = 3000; // O backend rodará na porta 3000

// Middlewares
app.use(cors()); // Permite acesso de qualquer origem (seu index.html)
app.use(express.json()); // Permite ao servidor entender JSON

// --- ROTAS DA API ---

// ROTA 1: Listar todos os cursos (Substitui o data.js)
app.get('/api/cursos', async (req, res) => {
  try {
    const db = await openDb();
    const cursos = await db.all('SELECT * FROM cursos');
    
    // Precisamos calcular o total de aulas para cada curso (como era no data.js)
    const cursosComTotal = await Promise.all(cursos.map(async (curso) => {
      const result = await db.get(`
        SELECT COUNT(a.id) AS totalAulas
        FROM aulas a
        JOIN modulos m ON a.modulo_id = m.id
        WHERE m.curso_id = ?
      `, curso.id);
      return {
        ...curso,
        totalAulas: result.totalAulas
      };
    }));
    
    res.json(cursosComTotal);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ROTA 2: Obter dados de UM curso (Substitui o curso-intensivo.js)
app.get('/api/cursos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await openDb();
    
    // 1. Pega o curso
    const curso = await db.get('SELECT titulo FROM cursos WHERE id = ?', id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // 2. Pega os módulos
    const modulos = await db.all('SELECT id, titulo FROM modulos WHERE curso_id = ? ORDER BY ordem', id);

    // 3. Pega as aulas de cada módulo
    // Precisamos recriar a estrutura JSON idêntica à que você tinha
    const modulosComAulas = await Promise.all(modulos.map(async (modulo) => {
      const aulas = await db.all(
        'SELECT titulo, url_video AS url, materiais FROM aulas WHERE modulo_id = ? ORDER BY ordem',
        modulo.id
      );
      return {
        titulo: modulo.titulo,
        aulas: aulas
      };
    }));
    
    // 4. Monta o objeto final (idêntico ao seu 'cursoData')
    const cursoData = {
      titulo: curso.titulo,
      modulos: modulosComAulas
    };
    
    res.json(cursoData);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// (Futuramente, aqui entrarão as rotas de progresso e login)
// POST /api/progresso
// GET /api/progresso

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});