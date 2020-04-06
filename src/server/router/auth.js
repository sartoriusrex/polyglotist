const router = require('express').Router();
const authHandlers = require('../handlers/auth');

// Login Logout
router.post('/login', authHandlers.loginUser);
router.get('/logout', authHandlers.logoutUser);

// Signup
router.post('/signup', authHandlers.addUser);

module.exports = router;
