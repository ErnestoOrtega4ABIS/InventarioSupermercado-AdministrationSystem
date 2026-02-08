import express from 'express';
import { 
    getNotifications, 
    markAsRead, 
    deleteNotification 
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); 

router.get('/:supermarketId', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;