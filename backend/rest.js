const express = require('express');
const bodyParser = require('body-parser');

const app = express();

budgetEntries = [
    {id: 1, group: "Fixkosten", title: "Miete", value: 1450},
    {id: 2, group: "Freizeit", title: "Netflix", value: 67},
    {id: 3, group: "Freizeit", title: "Kino", value: 787}, 
];

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.get('/max-id', (req, res) => {
    var max =0;
    for (var i=0; i<budgetEntries.length; i++){
        if(budgetEntries[i].id > max){
            max = budgetEntries[i].id
        }
    }
    res.json({maxId: max});
})

app.delete('/remove-entry/:id', (req, res) => {
    const index =  budgetEntries.findIndex(el => {
        return el.id == req.params.id; 
    })
    budgetEntries.splice(index, 1);
    res.status(200).json({
        message: 'Post Deleted'
    })

})

app.post('/add-entry', (req,res) =>{
    budgetEntries.push({id: req.body.id, group: req.body.group, title: req.body.title, value: req.body.value})
    res.status(200).json({
        message: 'Post submitted'
    })
})

app.get('/budget-entries', (req, res, next) => {
    res.json({'budgetEntries': budgetEntries});
}) 

module.exports = app; 
