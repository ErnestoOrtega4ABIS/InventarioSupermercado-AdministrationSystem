import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

// @desc    Get dashboard statistics for a specific supermarket
// @route   GET: /api/dashboard/stats/:supermarketId
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const { supermarketId } = req.params;
        const id = Array.isArray(supermarketId) ? supermarketId[0] : supermarketId;
        const objectId = new mongoose.Types.ObjectId(id);

        // Main Stats KPI Cards
        const generalStats = await Product.aggregate([
            { $match: { supermarket: objectId, active: true } },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
                    uniqueCategories: { $addToSet: "$category" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalProducts: 1,
                    totalValue: 1,
                    totalCategories: { $size: "$uniqueCategories" }
                }
            }
        ]);

        // Alerts KPI Card 
        const lowStockCount = await Product.countDocuments({
            supermarket: objectId,
            active: true,
            $expr: { $lte: ["$stock", "$minStock"] }
        });

        // Products by Category for Chart
        const productsByCategory = await Product.aggregate([
            { $match: { supermarket: objectId, active: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", value: "$count" } } 
        ]);

        const lowestStockProducts = await Product.find({ 
            supermarket: objectId, 
            active: true,
            $expr: { $lte: ["$stock", "$minStock"] } // Only if stock is less than or equal to minStock
        })
        .sort({ stock: 1 }) 
        .limit(8); // Could be more than 8 if there are ties in stock levels
        
        // Recently Added Products Table
        const recentProducts = await Product.find({ supermarket: objectId, active: true })
            .sort({ createdAt: -1 }) // Order by most recent
            .limit(5)
            .select('name category price createdAt');

        // Prepare the main stats, ensuring we have default values if no products exist
        const stats = generalStats.length > 0 
            ? generalStats[0] 
            : { totalProducts: 0, totalValue: 0, totalCategories: 0 };
        
        // Send all the data in a structured format for the frontend
        res.status(200).json({
            kpis: {
                totalProducts: stats.totalProducts,
                totalValue: stats.totalValue,
                totalCategories: stats.totalCategories,
                lowStockAlerts: lowStockCount
            },
            charts: {
                productsByCategory
            },
            tables: {
                lowestStock: lowestStockProducts,
                recentlyAdded: recentProducts
            }
        });

    } catch (error) {
        console.error("Error en getDashboardStats:", error);
        res.status(500).json({ message: 'Error al obtener las estadísticas del dashboard' });
    }
};