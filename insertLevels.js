const express = require('express');
const router = express.Router();
const db = require('./models');
const moment = require('moment');

var init_database = () => {
level_array = [5,8,11,14,17];
    for (let index = 0; index < level_array.length; index++) {
    db.Level.create({
        level: level_array[index],
        wc_status: 0,
        we_status: 0,
        we_start_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        wc_start_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        dc_status: 0,
        de_status: 0,
        dc_start_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        de_start_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        current: [0,0,0,0],
        mon: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
        tue: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
        wed: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
        thu: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
        fri: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
        sat: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
        sun: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
        });
    }
}

module.exports = init_database
