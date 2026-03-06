import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// @desc    Get all users (with role-based access control)
// @route   GET /api/users
// @access  Private (Ideally only Admin)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        const { role, supermarket } = req.user; // Get role and supermarket from authenticated user

        let query = {}; // By default, an empty query (fetches all)

        // BUSINESS LOGIC FOR VIEWING USERS:
        if (role === 'manager') {
            // If the user is a manager, they can only see users from their assigned supermarket
            query = { supermarket: supermarket };
        } 
        // If the user is an admin, the query remains empty and fetches all users.

        const users = await User.find(query)
            .select('-password')
            .populate('supermarket', 'name address'); 
            
        res.status(200).json(users);
    } catch (error) {
        console.error(`[Error in getUsers]: ${error}`);
        res.status(500).json({ message: 'Error interno al obtener la lista de usuarios' });
    }
};

// @desc    Create a new user (Worker, Manager, etc.)
// @route   POST /api/users
// @access  Private (Ideally only Admin)
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role, supermarket, active } = req.body;

        // Verify that the email is not already registered
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'El correo proporcionado ya está registrado' });
            return;
        }


        // Create the user with hashed password
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: password,
            role: role || 'worker',
            // If the role is 'worker' or 'manager', we expect a supermarket ID. For 'admin' or 'provider', it should be null.
            supermarket: supermarket || undefined, 
            status: active ?? true
        });

        // Populate the supermarket field before sending the response
        const populatedUser = await User.findById(newUser._id)
            .select('-password')
            .populate('supermarket', 'name');

        res.status(201).json(populatedUser);
    } catch (error) {
        console.error(`[Error in createUser]: ${error}`);
        res.status(500).json({ message: 'Error interno al crear el usuario' });
    }
};

// @desc    Update a user (Worker, Manager, etc.)
// @route   PUT /api/users/:id
// @access  Private (Ideally only Admin)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { password, ...updateData } = req.body;

        // Conditional management of password update: Only hash if a new password is provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Clean up the updateData based on role changes:
        // If the role is being updated to 'admin' or 'provider', we should remove any supermarket association since they don't need it.
        if (updateData.role === 'admin' || updateData.role === 'provider' || !updateData.supermarket) {
            updateData.$unset = { supermarket: 1 }; // Operate a unsetting the supermarket field if the role is admin/provider or if supermarket is not provided
            delete updateData.supermarket;          // We also delete it from the updateData to avoid confusion
        }

        // Update the user and return the updated document
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true } // runValidators ensures that the schema validations are applied during update
        ).select('-password').populate('supermarket', 'name');

        if (!updatedUser) {
            res.status(404).json({ message: 'Usuario no encontrado en la base de datos' });
            return;
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(`[Error in updateUser]: ${error}`);
        res.status(500).json({ message: 'Error interno al actualizar el usuario' });
    }
};

// @desc    Soft delete a user (set status to false)
// @route   DELETE /api/users/:id
// @access  Private (Ideally only Admin)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Apply a soft delete by setting the status to false instead of removing the document from the database
        const user = await User.findByIdAndUpdate(id, { status: false });
        
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json({ message: 'Usuario dado de baja correctamente' });
    } catch (error) {
        console.error(`[Error in deleteUser]: ${error}`);
        res.status(500).json({ message: 'Error interno al dar de baja al usuario' });
    }
};