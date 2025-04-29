require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializa o app Express
const app = express();

// Configuração de CORS
app.use(cors());

// Middleware para tratar dados JSON no corpo da requisição
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch(err => console.log('Erro ao conectar ao MongoDB: ', err));

// Rotas principais (você pode adicionar outras aqui)
app.get('/', (req, res) => {
  res.send('API de Apostas So Jogo Moz está funcionando!');
});

// Adicione suas rotas de autenticação, usuários e outras funcionalidades
// Exemplo: app.use('/auth', require('./routes/auth'));

// Definindo a porta para o servidor
const PORT = process.env.PORT || 5000;

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
