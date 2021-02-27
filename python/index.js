const {spawn} = require('child_process');

// Run this script with node index.js

var dataToSend;
var param = {
    mon: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0", // 00:00-00:59, 01:00-01:59, etc until 23:00-23:59
    tue: "0,0,0,0,0,0,0,0,30,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    wed: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    thu: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    fri: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    sat: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    sun: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
};

// spawn new child process to call the python script
const python = spawn('python', ['./python/script.py', JSON.stringify(param)]);

// collect data from script
python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
});
// in close event we are sure that stream from child process is closed
python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    console.log(dataToSend);
});