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
      const query = await db.query(
        'SELECT id FROM users WHERE name = $1',
        [username]
      );

      if (query.rows[0]) 
        return res.status(401)
          .send({ message: 'User already exists.' });

    } catch (err) {
      console.log('No user found. we can continue creating user.');
    }

    try {
      const query = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name',
        [
          username,
          email,
          hashedPassword
        ]
      );

      const { id, name } = query.rows[0];

      const token = jwt.sign(
        { id, name },
        process.env.SECRET_KEY
      );
      const user = { id, name };
      const payload = { token, id, name };

      res.cookie('accessToken', payload, thirtyDayCookie);
      return res.status(200)
        .send({ 
          user, 
          message: 'Welcome to Polyglotist!' 
        });
    } catch (err) {
      return res.status(400)
        .send({ message: 'Error adding user' });
    }
  },

  loginUser: async (req, res) => {
    const { accessToken } = req.cookies;

    if (accessToken) {
      try {
        const { name: nameInToken, token } = accessToken;
        const query = await db.query('SELECT id, name, password FROM users WHERE name = $1', [nameInToken]);
        const { id, name } = query.rows[0];
        const user = { id, name };
        const verified = jwt.verify( token, process.env.SECRET_KEY, function( err, decoded ) {
          if( decoded ) return true;
          return false;
        });

        if (verified) return res.status(200).send({ 
          user, 
          message: 'Welcome Back!' 
        });
        return res.status(401)
          .send({ message: 'Please log in.'})
      } catch (err) {
        console.log(err);
        return res.status(400)
          .send({ message: 'Could not find the user.'});
      }

    } else {
      const { username, password: candidatePassword } = req.body;

      if (!username || !candidatePassword ) {
        const user = null
        return res.status(200).send({ user });
      }

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
          const payload = { token, id, name };

          res.cookie('accessToken', payload, thirtyDayCookie);
          return res.status(200)
            .send({ 
              user, 
              message: 'Welcome Back!' 
            });
        } else {
          return res.status(403)
            .send({ message: 'Incorrect Password' });
        }
      } catch (err) {
        return res.status(400)
          .send({ message: 'User not found.' });
      }
    }
  },

  logoutUser: async (req, res) => {
    res.clearCookie('accessToken');
    return res.status(200)
      .send({ message: 'Logged Out.' });
  }
};
