import express from 'express';
const router = express.Router();
import userHandlers from '../handlers/users';
import middleware from '../middlewares/auth';

// GET
router.get('/', userHandlers.getAllUsers);
router.get('/:username', userHandlers.getOneUser);

// UPDATE / PATCH
router.patch('/:username', middleware.checkAuth, userHandlers.updateUser);

// DELETE
router.delete('/:username', middleware.checkAuth, userHandlers.deleteUser);

export default router;
