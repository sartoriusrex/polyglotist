const pool = require('../database');

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
    const { name, email } = req.body;
    try {
      const mutation = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2)',
        [name, email]
      );
      res.status(200).send({ user: mutation.rows });
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
