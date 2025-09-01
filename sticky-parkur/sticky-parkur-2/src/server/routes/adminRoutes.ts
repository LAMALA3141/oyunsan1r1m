import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();
const adminController = new AdminController();

// Route to get access codes
router.get('/access-codes', authenticateAdmin, adminController.getAccessCodes);

// Route to create a new access code
router.post('/access-codes', authenticateAdmin, adminController.createAccessCode);

// Route to delete an access code
router.delete('/access-codes/:codeId', authenticateAdmin, adminController.deleteAccessCode);

// Route to update game settings
router.put('/settings', authenticateAdmin, adminController.updateGameSettings);

// Route to get game settings
router.get('/settings', authenticateAdmin, adminController.getGameSettings);

export default router;