import express from 'express';
import { 
    createSupermarket, 
    getSupermarkets, 
    updateSupermarket, 
    deleteSupermarket 
} from '../controllers/supermarketController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getSupermarkets);
router.post('/', adminOnly, createSupermarket);
router.put('/:id', adminOnly, updateSupermarket);
router.delete('/:id', adminOnly, deleteSupermarket);

export default router;