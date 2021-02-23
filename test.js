const CronJob = require('cron').CronJob;
const db = require('./models');
const moment = require('moment');

function replaceAt(string, index, replacement) {
    return string.substring(0, index ) +replacement + string.substring(index + replacement.length);
}

function incrementValueFromCSVLine(string, index, val) {
    return replaceAt(string, index, (parseInt(string.charAt(index)) + val).toString());
}

const laundrydata = db.Level.findByPk(8);
const day = moment().format('ddd').toLowerCase();
const hour = parseInt(moment().format('HH'));
let dailyData;
laundrydata.then(x => {
    dailyData = x.getDataValue(day);
    console.log(`${day}-${hour}:${dailyData}`);
    dailyData = incrementValueFromCSVLine(dailyData, hour * 2, 3);
    console.log(`${day}-${hour}:${dailyData}`);
    return [x, dailyData];
})
.then(res =>{
    let query = {};
    query[day] = res;
    db.Level.update(query, {
        where: {
            level: 8
        }
    }).then(result => console.log(result));
}
).catch(err => console.log(err));
