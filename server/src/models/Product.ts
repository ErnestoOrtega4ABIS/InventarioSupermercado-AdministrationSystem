import mongoose, { Schema, Document, Types } from 'mongoose';

//SKU: Unique code for the product, often a barcode or unique identifier. It is required and must be unique within the same supermarket. This allows different supermarkets to have products with the same SKU without conflict.

export interface IProduct extends Document {
    name: string;
    sku: string; // Unique code for the product, required and unique within the same supermarket
    description?: string;
    price: number;
    stock: number;     
    minStock: number;  
    image?: string;
    category?: string;
    supermarket: Types.ObjectId;
    active: boolean;
}

const ProductSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'El SKU es obligatorio'],
        uppercase: true,
        trim: true
    },
    description: { type: String },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: 0
    },
    stock: {
        type: Number,
        required: [true, 'El stock inicial es obligatorio'],
        min: 0
    },
    minStock: {
        type: Number,
        default: 10,
        min: 1
    },
    image: { type: String, default: 'default-product.jpg' },
    category: { type: String, default: 'General' },
    supermarket: {
        type: Schema.Types.ObjectId,
        ref: 'Supermarket',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Compound index to ensure SKU uniqueness within the same supermarket
// (Two supermarkets could have the same SKU, but a single supermarket cannot have duplicate SKUs)
ProductSchema.index({ sku: 1, supermarket: 1 }, { unique: true });

export default mongoose.model<IProduct>('Product', ProductSchema);