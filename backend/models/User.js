const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: 6
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);