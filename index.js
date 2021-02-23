const express = require('express');
const path = require('path');
const db = require('./models');
const logger = require('./logger/logger');
const app = express();
const CronJob = require('cron').CronJob;
const tz = 'Asia/Singapore';

const initDatabase = require('./insertLevels.js');
const cronFunction = require('./cronUpdate.js');

const PORT = process.env.PORT || 5000;

app.use(logger);

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true }));

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

initDatabase();

xjob = new CronJob('* * * * *', cronFunction , null, true, tz);
xjob.start();

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on ${PORT}`);
    });
});





