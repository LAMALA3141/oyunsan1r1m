import { Schema, model } from 'mongoose';

const accessCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    levelAccess: {
        type: Number,
        required: true
    },
    infiniteMoney: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AccessCode = model('AccessCode', accessCodeSchema);

export default AccessCode;