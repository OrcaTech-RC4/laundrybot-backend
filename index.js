const express = require('express');
const path = require('path');
const db = require('./models');
const logger = require('./logger/logger');
const app = express();
const CronJob = require('cron').CronJob;
const { Level } = require('./sequelize');
const tz = 'Asia/Singapore';

const PORT = process.env.PORT || 5000;

app.use(logger);

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true }));

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on ${PORT}`);
    });
});

//Cronjob
//I did it this way instead of findall query because I thought we need to update the data per level
function getNumberofActiveMachines(no) {
    const laundrydata = await Level.findByPK(no); //if using sequelize 6. Not sure what's the version we r using
    let numberofActiveMachines = 0;
    let isActivewc = ((laundrydata.wcstatus === 1) || (laundrydata.wcstatus ===  2)) ? 1 : 0;
    let isActivewe = ((laundrydata.westatus === 1) || (laundrydata.westatus ===  2)) ? 1 : 0;
    let isActivedc = ((laundrydata.dcstatus === 1) || (laundrydata.dcstatus ===  2)) ? 1 : 0;
    let isActivede = ((laundrydata.destatus === 1) || (laundrydata.destatus ===  2)) ? 1 : 0;
    numberofActiveMachines = isActivewc + isActivewe + isActivedc + isActivede;
    return numberofActiveMachines;
}
function updateRecord(data, lvl) {
    const laundrydata = await Level.findByPK(lvl); 
    let updated_current = laundrydata.current;
    if (!updated_current) {
        updated_current = [];
    }
    else if (updated_current.length >= 288) {
        updated_current = [];
    }
    else {
        updated_current.push(data);
    }
    await laundrydata.update({ current: updated_current });
}
function doForAllLevel(func1, func2) {
    for (let i = 1; i <= 17; i++){ //check what the id(pk) is like 
        func2(func1(i), i);
    }
}
const job = new CronJob('5 * * * *', doForAllLevel(getNumberofActiveMachines, updateRecord) , null, true, tz);
job.start();

// app.get('/api/level/:id', (req, res) => {
//     const id = req.params.id;
//     const levels = [4, 7, 10, 13];

//     const found = levels.filter(value => value == id).length;

//     if (found) {
//         res.send(`Sending level ${id} data`);
//     } else {
//         res.status(400).json({
//             msg: `No laundry room in level ${id}`
//         })
//     }
// });






