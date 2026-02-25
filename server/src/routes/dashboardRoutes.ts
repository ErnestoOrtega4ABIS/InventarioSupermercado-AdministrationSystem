import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController'; 
const router = Router();

router.get('/stats/:supermarketId', getDashboardStats);

export default router;