const router = require('express').Router();
const userHandlers = require('../handlers/users');

// GET
router.get('/', userHandlers.getAllUsers);
router.get('/users/:user', userHandlers.getOneUser);

// POST
router.post('/users', userHandlers.addUser);

// UPDATE / PATCH
router.patch('/users/:user', userHandlers.updateUser);

// DELETE
router.delete('/users/:user', userHandlers.deleteUser);

module.exports = router;
