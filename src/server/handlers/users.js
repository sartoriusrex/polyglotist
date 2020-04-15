require('dotenv').config({ path: `${__dirname}/.env` });
const bcrypt = require('bcryptjs');
const db = require('../database');

const salt = 10;

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
    const username = req.params.username;
    const {
      updatedName,
      email,
      password,
      readingSpeed,
      themePreference,
      practiceMode,
      notificationMethod,
      languagePreference,
      languagesLearning
     } = req.body;
    const settings = [
      readingSpeed,
      themePreference,
      practiceMode,
      notificationMethod,
      languagePreference,
      languagesLearning
    ]
    let user = {};

    try {
      if (updatedName) {
        const newUsername = await db.query(
          'UPDATE users SET username = $1 WHERE username = $2 RETURNING username',
          [updatedName, username]
        )

        user.username = newUsername.rows[0];
      }

      if (email) {
        const newEmail = await db.query(
          'UPDATE users SET email = $1 WHERE username = $2 RETURNING email',
          [email, username]
        )

        user.email = newEmail.rows[0];
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, salt);
        const newPassword = await db.query(
          'UPDATE users SET password = $1 WHERE username = $2 RETURNING password',
          [hashedPassword, username]
        )

        user.password = newPassword.rows[0];
      }

      if (settings.length > 0) {
        const newSettings = await db.query(
          'UPDATE users SET reading_speed = $1, theme_preference = $2, practice_mode = $3, notification_method = $4, language_preference = $5, languages_learning = $6 WHERE username = $7 RETURNING reading_speed, theme_preference, practice_mode, notification_method, language_preference, languages_learning',
          [ ...settings, username ]
        )

        const {
          reading_speed,
          theme_preference,
          practice_mode,
          notification_method,
          language_preference,
          languages_learning
        } = newSettings.rows[0]

        user.readingSpeed = reading_speed;
        user.themePreference = theme_preference;
        user.practiceMode = practice_mode;
        user.notificationMethod = notification_method;
        user.languagePreference = language_preference;
        user.languagesLearning = languages_learning;
      }


      return res.status(200).send({ user, message: 'Successfully Updated Settings & Preferences' });
    } catch (err) {
      return res.status(400).send({ message: 'Error updating user' });
    }
  },

  deleteUser: async (req, res) => {
    const username = req.params.username;

    try {
      const mutation = await db.query('DELETE FROM users WHERE username = $1', [username]);

      return res
        .status(200)
        .send({ message: `Successfully deleted user ${mutation.rows[0]}` });
    } catch (err) {
      return res.status(400).send({ message: 'Error deleting user' });
    }
  },
};
