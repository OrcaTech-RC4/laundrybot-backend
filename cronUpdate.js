const CronJob = require('cron').CronJob;
const db = require('./models');
const moment = require('moment');

const tz = 'Asia/Singapore';

console.log("Starting cronUpdate");

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

function incrementValueFromCSVLine(string, index, val) {
    // return replaceAt(string, index, parseInt(string.charAt(index)) + val);
    let nextCommaIndex;
    for(let i = index; i < string.length; i++){
        if(string[i] == ','){
            nextCommaIndex = i;
            break;
        }
    }
    if(nextCommaIndex){
        return string.substring(0, index) + (parseInt(string.substring(index, nextCommaIndex)) + val) + string.substring(nextCommaIndex);
    }
    return string.substring(0, index) + (parseInt(string.substring(index)) + val);
}

//Cronjob
//I did it this way instead of findall query because I thought we need to update the data per level
function getNumberofActiveMachines(no) {
    const laundrydata = db.Level.findByPk(no); //if using sequelize 6
    let numberofActiveMachines = 0;
    let isActivewc = ((laundrydata.wcstatus === 1) || (laundrydata.wcstatus ===  2)) ? 1 : 0;
    let isActivewe = ((laundrydata.westatus === 1) || (laundrydata.westatus ===  2)) ? 1 : 0;
    let isActivedc = ((laundrydata.dcstatus === 1) || (laundrydata.dcstatus ===  2)) ? 1 : 0;
    let isActivede = ((laundrydata.destatus === 1) || (laundrydata.destatus ===  2)) ? 1 : 0;
    numberofActiveMachines = isActivewc + isActivewe + isActivedc + isActivede;
    return numberofActiveMachines;
}

function updateRecord(numOfActiveMachines, lvl) {
    const laundrydata = db.Level.findByPk(lvl);
    const day = moment().format('ddd').toLowerCase();
    const hour = parseInt(moment().format('HH'));
    let dailyData;

    laundrydata.then(x => {
        dailyData = x.getDataValue(day);
        console.log(`${day}-${hour}:${dailyData}`);
        dailyData = incrementValueFromCSVLine(dailyData, hour * 2, 3);
        console.log(`${day}-${hour}:${dailyData}`);
        return dailyData;
    })
    .then(data =>{
        let query = {};
        query[day] = data;
        db.Level.update(query, {
            where: {
                level: 8
            }
        }).then(result => console.log(result));
    }
    ).catch(err => console.log(err));
}

function doForAllLevel(func1, func2) {
    const levelsWithLaundry = [5, 8, 11, 14, 17];
    for (let i = 0; i < 5; i++) {
        const j = levelsWithLaundry[i];
        func2(func1(j), j);
    }
}

function cronFunction () {
    console.log(`${moment().format()}:Update for all level`);
    doForAllLevel(getNumberofActiveMachines, updateRecord);
}

module.exports = cronFunction;
