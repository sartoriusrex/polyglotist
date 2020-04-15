const router = require('express').Router();
const userHandlers = require('../handlers/users');
const { checkAuth } = require('../middlewares/auth');

// GET
router.get('/', userHandlers.getAllUsers);
router.get('/:user', userHandlers.getOneUser);

// UPDATE / PATCH
router.patch('/:user', checkAuth, userHandlers.updateUser);

// DELETE
router.delete('/:user', checkAuth, userHandlers.deleteUser);

module.exports = router;
