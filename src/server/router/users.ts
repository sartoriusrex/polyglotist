import express from 'express';
const router = express.Router();
import userHandlers from '../handlers/users';
import { checkAuth } from '../middlewares/auth';

// GET
router.get('/', userHandlers.getAllUsers);
router.get('/:username', userHandlers.getOneUser);

// UPDATE / PATCH
router.patch('/:username', checkAuth, userHandlers.updateUser);

// DELETE
router.delete('/:username', checkAuth, userHandlers.deleteUser);

export default router;
