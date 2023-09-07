const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // le champ "role" peut être soit 'user' soit 'admin'
        default: 'user'   // par défaut, le champ "role" est 'user'
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;