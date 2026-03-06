import { Request, Response } from 'express';
import Movement from '../models/Movement'; 

// @desc    Get all movements for a specific supermarket
// @route   GET /api/movements/supermarket/:supermarketId
// @access  Private
export const getMovementsBySupermarket = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supermarketId } = req.params;

        // Search for movements related to the specified supermarket, sorted by most recent
        const movements = await Movement.find({ supermarket: supermarketId })
            .sort({ createdAt: -1 }) 
            .populate('product', 'name sku'); // Only populate the product's name and SKU for better performance

        res.status(200).json(movements);
    } catch (error) {
        console.error("Error en getMovements:", error);
        res.status(500).json({ message: 'Error al obtener el historial de movimientos' });
    }
};