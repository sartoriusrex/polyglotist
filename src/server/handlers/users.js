require('dotenv').config({ path: `${__dirname}/.env` });

const db = require('../database');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const response = await db.query('SELECT * FROM users ORDER BY username ASC');

      const usersArray = response.rows;

      // Map over usersArray and return the same items, without the passwords
      const users = usersArray.map((user) => {
        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      });

      return res.status(200).send({ users });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Error getting all users' });
    }
  },

  getOneUser: async (req, res) => {
    const username = parseInt(req.params.username, 10);

    try {
      const response = await db.query('SELECT * FROM users WHERE username = $1', [
        username,
      ]);

      return res.status(200).send({ user: response.rows });
    } catch (err) {
      return res.status(400).send({ message: 'Error getting user' });
    }
  },

  updateUser: async (req, res) => {
    const username = parseInt(req.params.username, 10);
    const { email } = req.body;

    try {
      const mutation = await db.query(
        'UPDATE users SET username = $1, email = $2 WHERE username = $1',
        [username, email]
      );

      return res.status(200).send({ user: mutation.rows });
    } catch (err) {
      return res.status(400).send({ message: 'Error updating user' });
    }
  },

  deleteUser: async (req, res) => {
    const username = parseInt(req.params.username, 10);

    try {
      const mutation = await db.query('DELETE FROM users WHERE username = $1', [username]);

      return res
        .status(200)
        .send({ message: `Successfully deleted user ${mutation.user}` });
    } catch (err) {
      return res.status(400).send({ message: 'Error deleting user' });
    }
  },
};
