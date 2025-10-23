require('dotenv').config(); 
const generateExplanation = require('./gemini');
const express = require('express');
const bodyParser = require('body-parser');
const BudgetEntryModel = require('./entry-schema')
const AusgabenEntryModel =require('./ausgaben-schema')
const mongoose = require('mongoose');
const connectionString = process.env.CONNECTION_STRING;
const UserModel = require('./user-model')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const app = express();
const checkAuth = require('./check-auth');


mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(() => {
        console.log('Error connecting to MongoDB')
    })

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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


app.post('/add-entry', checkAuth, (req, res) => {
    const budgetEntry = new BudgetEntryModel({
        userId: req.user.id,
        group: req.body.group,
        title: req.body.title,
        value: req.body.value
    });

    budgetEntry.save()
        .then(() => {
            res.status(200).json({ message: 'Post submitted' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error saving entry' });
        });
});



app.get('/budget-entries', checkAuth, (req, res) => {
    BudgetEntryModel.find({ userId: req.user.id })
        .then((data) => {
            res.json({ budgetEntries: data });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Error fetching entries' });
        });
});

/////////////////////////////////////////////////////////////////////////////

app.delete('/remove-ausgaben/:id', (req, res) => {
    AusgabenEntryModel.deleteOne({_id: req.params.id})
        .then (() => {
                res.status(200).json({
        message: 'Post Deleted'
        })
    })
})

app.put('/update-ausgaben/:id', (req, res) => {
    const updatedEntry = new AusgabenEntryModel({_id: req.body.id, group: req.body.group, title: req.body.title, value: req.body.value})
    AusgabenEntryModel.updateOne({_id: req.body.id}, updatedEntry)
        .then(() => {
            res.status(200).json({ message: 'Update Completed' 
            });
        })
});


app.post('/add-ausgabe', checkAuth, (req, res) => {
    const ausgabenEntry = new AusgabenEntryModel({
        userId: req.user.id,
        group: req.body.group,
        title: req.body.title,
        value: req.body.value
    });

    ausgabenEntry.save()
        .then(() => {
            res.status(200).json({ message: 'Post submitted' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error saving entry' });
        });
});



app.get('/ausgaben-entries', checkAuth, (req, res) => {
    AusgabenEntryModel.find({ userId: req.user.id })
        .then((data) => {
            res.json({ ausgabenEntries: data });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Error fetching entries' });
        });
});

//////////////////////////////////////////////////////////////////////////////

app.post('/sign-up', (req, res) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userModel = new UserModel({
                username: req.body.username, 
                password: hash
            })

            userModel.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created',
                    result: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
})


app.post('/login', (req,res) => {

    let userFound;

    UserModel.findOne({username: req.body.username})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: 'User not found'
                })
            }
            userFound = user
            return bcrypt.compare(req.body.password, user.password)
        })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: 'Password is incorrect'
            })
        }

        const token = jwt.sign({username: userFound.username, userId: userFound._id}, "secret_string", {expiresIn:"1h"})
        return res.status(200).json({
            token: token,
            expiresIn: 3600
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Error with authentication'
        })
    })
})

app.post('/bill-value', checkAuth, async (req, res) => {
  try {
    const { prompt, image } = req.body;

    if (!prompt) return res.status(400).json({ message: "Missing prompt" });

    const responseText = await generateExplanation(prompt, image);

    res.status(200).json({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating response" });
  }
});




module.exports = app; 