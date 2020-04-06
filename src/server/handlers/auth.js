require('dotenv').config({ path: `${__dirname}/.env` });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database');
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
      const mutation = await pool.query(
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
      res.status(200).send({ user: mutation.rows[0] });
    } catch (err) {
      res.status(400).send({ message: 'Error adding user' });
      throw err;
    }
  },

  loginUser: async (req, res) => {
    const { username, password: candidatePassword } = req.body;


    try {
      const query = await pool.query(
        'SELECT id, name, password FROM users WHERE name = $1',
        [username]
      );

      const {
        id, name, password
      } = query.rows[0];

      const verifiedPassword = await bcrypt.compare(candidatePassword, password);

      if (verifiedPassword) {
        const token = jwt.sign(
          { id, name },
          process.env.SECRET_KEY
        );

        res.cookie('accessToken', token, thirtyDayCookie);
        res.status(200).send({ user: query.rows[0] });
      } else {
        res.status(403).send({ message: 'Incorrect Password' });
        throw Error('Incorrect Password');
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: 'Error logging in' });
      throw err;
    }
  },

  logoutUser: async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).send({ message: 'Logged Out.' });
  }
};
