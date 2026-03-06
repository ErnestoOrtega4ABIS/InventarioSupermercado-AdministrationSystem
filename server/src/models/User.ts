import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the IUser interface extending Mongoose's Document
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'admin' | 'worker' | 'provider' | 'manager';
    supermarket?: mongoose.Types.ObjectId;
    status: boolean; 
    googleId?: string;
    //Soft Delete
    deleteDate?: Date; 
    // Tokens if user requests password reset
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

//Define if the user is required to have a supermarket reference based on their role
const UserSchema: Schema = new Schema({
    firstName: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'], 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: [true, 'El apellido es obligatorio'], 
        trim: true 
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function(this: IUser) { return !this.googleId }, 
        minlength: 6,
        select: false 
    },
    role: {
        type: String,
        enum: ['admin', 'worker', 'provider', 'manager'],
        default: 'worker'
    },
    supermarket: {
        type: Schema.Types.ObjectId,
        ref: 'Supermarket', 
        required: false     
    },
    status: {
        type: Boolean,
        default: true
    },
    googleId: { type: String },
    deleteDate: { type: Date, default: null },
    
    resetPasswordToken: {
    type: String,
    required: false,
},
    resetPasswordExpire: {
    type: Date,
    required: false,
},
}, {
    timestamps: true, 
    versionKey: false
});

// Middleware (Hook) Pre-Save: Encrypt password before saving the user document
UserSchema.pre<IUser>('save', async function (this: IUser) {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);