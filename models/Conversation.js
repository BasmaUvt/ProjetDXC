'use strict';

const mongoose = require('mongoose');;

const ConversationSchema = new mongoose.Schema({
    participants: [String],
    messages: [
      {
        sender: String,
        recipient: String,
        content: String,
        date: { type: Date, default: Date.now }
      }
    ]
  });


const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
