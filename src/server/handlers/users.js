const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: `${__dirname}/.env` });

const pool = require('../database');
const thirtyDayCookie = require('../utils/constants');

const salt = 10;

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const response = await pool.query('SELECT * FROM users ORDER BY id ASC');
      res.status(200).send({ users: response.rows });
    } catch (err) {
      res.status(400).send({ message: 'Error getting all users' });
      throw err;
    }
  },

  getOneUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const response = await pool.query('SELECT * FROM users WHERE id = $1', [
        id
      ]);
      res.status(200).send({ user: response.rows });
    } catch (err) {
      res.status(400).send({ message: 'Error getting user' });
      throw err;
    }
  },

  addUser: async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const mutation = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name',
        [username, email, hashedPassword]
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

  updateUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, email } = req.body;
    try {
      const mutation = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id]
      );
      res.status(200).send({ user: mutation.rows });
    } catch (err) {
      res.status(400).send({ message: 'Error updating user' });
      throw err;
    }
  },

  deleteUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const mutation = await pool.query('DELETE FROM users WHERE id = $1', [
        id
      ]);
      res
        .status(200)
        .send({ message: `Successfully deleted user ${mutation.user}` });
    } catch (err) {
      res.status(400).send({ message: 'Error deleting user' });
    }
  }
};
