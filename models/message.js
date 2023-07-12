'use strict';

import mongoose from 'mongoose';

let messageSchema = new mongoose.Schema({
    content: String,
    username: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
