// Importa as bibliotecas
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// Função assíncrona para abrir a conexão
async function openDb() {
  return open({
    filename: './cursos.db', // O nome do arquivo do banco de dados
    driver: sqlite3.Database
  });
}

// Exporta a função para ser usada em outros arquivos
module.exports = openDb;