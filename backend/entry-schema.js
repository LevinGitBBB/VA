const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
    group: String, 
    title: String,
    value: String, 
});

module.exports = mongoose.model('BudgetEntry', entrySchema) ;
