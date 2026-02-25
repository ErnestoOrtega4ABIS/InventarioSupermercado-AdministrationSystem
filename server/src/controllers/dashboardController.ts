import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

// @desc    Obtener todas las estadísticas del dashboard para un supermercado específico
// @route   GET: /api/dashboard/stats/:supermarketId
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const { supermarketId } = req.params;
        const id = Array.isArray(supermarketId) ? supermarketId[0] : supermarketId;
        const objectId = new mongoose.Types.ObjectId(id);

        // Estadísticas Generales (Tarjetas KPI)
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

        // Alertas de Stock Bajo (Tarjetas KPI)
        const lowStockCount = await Product.countDocuments({
            supermarket: objectId,
            active: true,
            $expr: { $lte: ["$stock", "$minStock"] }
        });

        // Productos por Categoría (Para la gráfica de Dona/Pastel)
        const productsByCategory = await Product.aggregate([
            { $match: { supermarket: objectId, active: true } },
            // Agrupamos por el nombre de la categoría y contamos cuántos hay
            { $group: { _id: "$category", count: { $sum: 1 } } },
            // Renombramos _id a "name" y count a "value" (Formato ideal para librerías de gráficas en React/Angular)
            { $project: { _id: 0, name: "$_id", value: "$count" } } 
        ]);

        const lowestStockProducts = await Product.find({ 
            supermarket: objectId, 
            active: true,
            $expr: { $lte: ["$stock", "$minStock"] } // Solo jala los que están en crítico
        })
        .sort({ stock: 1 }) 
        .limit(8); // Puedes subir el límite si quieres ver más alertas críticas
        
        // Agregados Recientemente (Para tabla de "Novedades")
        const recentProducts = await Product.find({ supermarket: objectId, active: true })
            .sort({ createdAt: -1 }) // Ordenamos por fecha de creación (los más nuevos primero)
            .limit(5)
            .select('name category price createdAt');

        // Preparamos la respuesta final
        const stats = generalStats.length > 0 
            ? generalStats[0] 
            : { totalProducts: 0, totalValue: 0, totalCategories: 0 };
        
        // Enviamos todo en un solo objeto JSON
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