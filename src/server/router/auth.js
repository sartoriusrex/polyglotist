const router = require('express').Router();
const authHandlers = require('../handlers/auth');
const { check } = require('express-validator');

function checkEmail() {
  return check('email').isEmail().not().isEmpty().trim()
}

function checkUsername() {
  return check('username').isLength({ min: 8, max: 16 }).not().isEmpty().trim()
}

function checkPassword() {
  check('password').isLength({ min: 8, max: 30 }).not().isEmpty().trim()
}

// Login Logout
router.post('/login', authHandlers.loginUser);
router.get('/logout', authHandlers.logoutUser);

// Signup
router.post(
  '/signup',
  [
    checkEmail,
    checkUsername,
    checkPassword
  ],
  authHandlers.addUser
);

module.exports = router;
