require('dotenv').config({ path: `${__dirname}/.env` });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const thirtyDayCookie = require('../utils/constants');

const salt = 10;

module.exports = {
  addUser: async (req, res) => {
    const {
      username,
      email,
      password
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const mutation = await db.query('SELECT id FROM users WHERE name = $1',
        [username]);

      if (mutation.rows[0]) return res.status(401).send({ message: 'User already exists.' });

    } catch (err) {
      console.log('No user found. we can continue creating user.');
    }

    try {
      const mutation = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name',
        [
          username,
          email,
          hashedPassword
        ]
      );

      const { id, name } = mutation.rows[0];

      const token = jwt.sign(
        { id, name },
        process.env.SECRET_KEY
      );

      res.cookie('accessToken', token, thirtyDayCookie);
      res.status(200).send({ user: mutation.rows[0], message: 'Welcome to Polyglotist!' });
    } catch (err) {
      res.status(400).send({ message: 'Error adding user' });
    }
  },

  loginUser: async (req, res) => {
    const { username, password: candidatePassword } = req.body;

    try {
      const query = await db.query(
        'SELECT id, name, password FROM users WHERE name = $1',
        [username]
      );

      const {
        id,
        name,
        password
      } = query.rows[0];

      const verifiedPassword = await bcrypt.compare(candidatePassword, password);

      if (verifiedPassword) {
        const token = jwt.sign(
          { id, name },
          process.env.SECRET_KEY
        );

        const user = {id, name};

        res.cookie('accessToken', token, thirtyDayCookie);
        res.status(200).send({ user, message: 'Welcome Back!' });
      } else {
        res.status(403).send({ message: 'Incorrect Password' });
      }
    } catch (err) {
      res.status(400).send({ message: 'User not found.' });
    }
  },

  logoutUser: async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).send({ message: 'Logged Out.' });
  }
};
