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
async function getNumberofActiveMachines(lvl) {
    const laundrydata = db.Level.findByPk(lvl);
    var numberofActiveMachines = 0;
    await laundrydata.then(x => {
        const wc = x.getDataValue("wc_status") > 0;
        const we = x.getDataValue("we_status") > 0;
        const dc = x.getDataValue("dc_status") > 0;
        const de = x.getDataValue("de_status") > 0;
        
        numberofActiveMachines = wc + we + dc + de;
    }).catch(err => {
        console.log(err);
    });
    
    return numberofActiveMachines;
}

function updateRecord(numOfActiveMachines, lvl) {
    const laundrydata = db.Level.findByPk(lvl);
    const day = moment().format('ddd').toLowerCase();
    const hour = parseInt(moment().format('HH'));
    let dailyData;

    laundrydata.then(x => {
        dailyData = x.getDataValue(day);
        console.log(`level-${lvl}:numActive-${numOfActiveMachines}:before:day-${day}:hour-${hour}:${dailyData}`);
        dailyData = incrementValueFromCSVLine(dailyData, hour * 2, numOfActiveMachines);
        console.log(`level-${lvl}:numActive-${numOfActiveMachines}:afteri:day-${day}:hour-${hour}:${dailyData}`);
        return dailyData;
    })
    .then(data =>{
        let query = {};
        query[day] = data;
        db.Level.update(query, {
            where: {
                level: lvl
            }
        }).then(result => console.log(result));
    }
    ).catch(err => console.log(err));
}

function doForAllLevel() {
    const levelsWithLaundry = [5, 8, 11, 14, 17];
    levelsWithLaundry.forEach(x => {
        getNumberofActiveMachines(x).then(a => { updateRecord(a, x); });
    });
}

function cronFunction () {
    console.log(`${moment().format()}:Update for all level`);
    doForAllLevel();
}

module.exports = cronFunction;
