require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const BudgetEntryModel = require('./entry-schema')
const mongoose = require('mongoose');
const connectionString = process.env.CONNECTION_STRING;



const app = express();

mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(() => {
        console.log('Error connecting to MongoDB')
    })

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.delete('/remove-entry/:id', (req, res) => {
    BudgetEntryModel.deleteOne({_id: req.params.id})
        .then (() => {
                res.status(200).json({
        message: 'Post Deleted'
        })
    })
})

app.put('/update-entry/:id', (req, res) => {
    const updatedEntry = new BudgetEntryModel({_id: req.body.id, group: req.body.group, title: req.body.title, value: req.body.value})
    BudgetEntryModel.updateOne({_id: req.body.id}, updatedEntry)
        .then(() => {
            res.status(200).json({ message: 'Update Completed' 
            });
        })
});


app.post('/add-entry', (req,res) =>{
    const budgetEntry = new BudgetEntryModel({group: req.body.group, title: req.body.title, value: req.body.value});
    budgetEntry.save()
        .then(() => {
                res.status(200).json({
                    message: 'Post submitted'
                })
        })
})


app.get('/budget-entries', (req, res, next) => {
    BudgetEntryModel.find()
    .then((data) => {
        res.json({'budgetEntries': data})
    })
    .catch(() => {
        console.log('Error fetching entries')
    })
}) 

module.exports = app; 
