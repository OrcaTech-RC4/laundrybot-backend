const express = require('express');
const router = express.Router();
const db = require('../models');
const moment = require('moment');

router.get('/get-update/:level', (req, res) => {
    db.Level.findAll({
        where: {
            level: req.params.level
        }
    }).then(entries => res.send(entries))
    .catch(err => console.log(err));
});

router.post('/create-update', (req, res) => {
    db.Level.create({
        status: req.body.status,
        level: req.body.level,
        timeCreated: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    }).then(submittedUpdate => res.send(submittedUpdate))
    .catch(err => console.log(err));
}

);

module.exports = router;
