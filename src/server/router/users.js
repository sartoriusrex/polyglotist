const router = require('express').Router();
const userHandlers = require('../handlers/users');

// GET
router.get('/', userHandlers.getAllUsers);
router.get('/:user', userHandlers.getOneUser);

// UPDATE / PATCH
router.patch('/:user', userHandlers.updateUser);

// DELETE
router.delete('/:user', userHandlers.deleteUser);

module.exports = router;
