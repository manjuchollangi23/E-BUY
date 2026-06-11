import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserRole
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only user routes
router.route('/users')
  .get(protect, admin, getUsers);
router.route('/users/:id')
  .delete(protect, admin, deleteUser);
router.route('/users/:id/role')
  .put(protect, admin, updateUserRole);

export default router;
