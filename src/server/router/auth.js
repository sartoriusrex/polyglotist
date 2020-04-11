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
    check('email').isEmail().not().isEmpty().trim(),
    check('username').isLength({ min: 8, max: 16 }).not().isEmpty().trim(),
    check('password').isLength({ min: 8, max: 30 }).not().isEmpty().trim(),
  ],
  authHandlers.addUser
);

module.exports = router;
