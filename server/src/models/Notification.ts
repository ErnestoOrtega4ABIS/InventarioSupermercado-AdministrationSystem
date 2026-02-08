import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
    type: 'STOCK_ALERT' | 'SYSTEM_MSG';
    message: string;
    supermarket: Types.ObjectId; 
    product?: Types.ObjectId; 
    read: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    type: {
        type: String,
        enum: ['STOCK_ALERT', 'SYSTEM_MSG'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    supermarket: {
        type: Schema.Types.ObjectId,
        ref: 'Supermarket',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, 
    versionKey: false
});

export default mongoose.model<INotification>('Notification', NotificationSchema);