const router = require('express').Router();
const userHandlers = require('../handlers/users');
const { checkAuth } = require('../middlewares/auth');

// GET
router.get('/', userHandlers.getAllUsers);
router.get('/:username', userHandlers.getOneUser);

// UPDATE / PATCH
router.patch('/:username', checkAuth, userHandlers.updateUser);

// DELETE
router.delete('/:username', checkAuth, userHandlers.deleteUser);

module.exports = router;
