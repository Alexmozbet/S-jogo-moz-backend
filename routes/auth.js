const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Supondo que você tenha um modelo de usuário
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Verifica se os dados foram fornecidos
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
  }

  try {
    // Verifica se o email já está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Email já está em uso.' });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria um novo usuário
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Gera o token JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: newUser._id, username, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verifica se o email e senha foram fornecidos
  if (!email || !password) {
    return res.status(400).json({ msg: 'Por favor, forneça o email e a senha.' });
  }

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    // Compara a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;
