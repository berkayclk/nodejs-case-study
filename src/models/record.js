import { model, Schema } from 'mongoose';

const recordSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        counts: {
            type: [Number],
            required: true,
            default: [],
        },
        createdAt: {
            type: Date,
            required: true,
            default: new Date(),
        },
    },
    {
        timestamp: {
            createdAt: 'createdAt',
        },
    }
);

export default model('record', recordSchema);
