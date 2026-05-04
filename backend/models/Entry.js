const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: false },
    amount: { type: Number, required: true }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventType: {
        type: String,
        enum: ['Vivah', 'Tilak'],
        required: true
    },
    personName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    entries: [entrySchema]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);