const router = require('express').Router();
const authHandlers = require('../handlers/auth');
const { check } = require('express-validator');

// Login Logout
router.post('/login', authHandlers.loginUser);
router.get('/logout', authHandlers.logoutUser);

// Signup
router.post(
  '/signup',
  [
    check('email').isEmail(),
    check('username').isLength({ min: 8, max: 16 }),
    check('password').isLength({ min: 8, max: 30 }),
  ],
  authHandlers.addUser
);

module.exports = router;
