const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: String, 
    title: String,
    value: String, 
});

module.exports = mongoose.model('BudgetEntry', entrySchema) ;
