require('dotenv').config({ path: `${__dirname}/.env` });

const db = require('../database');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const response = await db.query('SELECT * FROM users ORDER BY name ASC');

      const usersArray = response.rows;

      // Map over usersArray and return the same items, without the passwords
      const users = usersArray.map((user) => {
        return {
          id: user.id,
          email: user.email,
          username: user.name,
        };
      });

      return res.status(200).send({ users });
    } catch (err) {
      return res.status(400).send({ message: 'Error getting all users' });
    }
  },

  getOneUser: async (req, res) => {
    const name = parseInt(req.params.name, 10);

    try {
      const response = await db.query('SELECT * FROM users WHERE name = $1', [
        name,
      ]);

      return res.status(200).send({ user: response.rows });
    } catch (err) {
      return res.status(400).send({ message: 'Error getting user' });
    }
  },

  updateUser: async (req, res) => {
    const name = parseInt(req.params.name, 10);
    const { username, email } = req.body;

    try {
      const mutation = await db.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [username, email, id]
      );

      return res.status(200).send({ user: mutation.rows });
    } catch (err) {
      return res.status(400).send({ message: 'Error updating user' });
    }
  },

  deleteUser: async (req, res) => {
    const name = parseInt(req.params.name, 10);

    try {
      const mutation = await db.query('DELETE FROM users WHERE id = $1', [name]);

      return res
        .status(200)
        .send({ message: `Successfully deleted user ${mutation.user}` });
    } catch (err) {
      return res.status(400).send({ message: 'Error deleting user' });
    }
  },
};
