const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupName: String, 
    maxSpending: Number
});

module.exports = mongoose.model('GroupEntry', groupSchema) ;
