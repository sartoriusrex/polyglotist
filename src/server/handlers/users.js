const pool = require('../database');

module.exports = {
  getAllUsers: async (req, res) => {
    pool.query(
      'SELECT * FROM users ORDER BY id ASC',
      (error, results) => {
        if (error) {
          res.status(400)
            .send({ message: 'Error getting all users' });
          throw error;
        } else {
          res.status(200)
            .send({ users: results.rows });
        }
      }
    );
  },
  getOneUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);

    pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
      (error, results) => {
        if (error) {
          res.status(400)
            .send({ message: 'Error getting user' });
          throw error;
        } else {
          res.status(200)
            .send({ user: results.rows });
        }
      }
    );
  },
  addUser: async (req, res) => {
    const { name, email } = req.body;

    pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2)',
      [name, email],
      (error, results) => {
        if (error) {
          res.status(400)
            .send({ message: 'Error adding user' });
          throw error;
        } else {
          res.status(200)
            .send({ user: results.rows });
        }
      }
    );
  },
  updateUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, email } = req.body;

    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          res.status(400)
            .send({ message: 'Error updating user' });
        } else {
          res.status(200)
            .send({ user: results.rows });
        }
      }
    );
  },
  deleteUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);

    pool.query(
      'DELETE FROM users WHERE id = $1',
      [id],
      (error, results) => {
        if (error) {
          res.status(400)
            .send({ message: 'Error deleting user' });
        } else {
          res.status(200)
            .send({ message: `Successfully deleted user ${results.user}` });
        }
      }
    );
  }
};
