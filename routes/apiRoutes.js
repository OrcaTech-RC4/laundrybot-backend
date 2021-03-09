const express = require('express');
const router = express.Router();
const db = require('../models');
const moment = require('moment');

router.get('/levels', (req,res) => {
    let respData = {}
    try {
        res.send([5,8,11,14,17]);
    } catch(err) {
        respData.success = false
        respData.message = err.name
        res.send(respData)
    }   
})

router.get('/levels/:level/statuses', async (req,res) => {
    let respData = []
    try {
        const level = req.params.level
        const wc = await db.Level.findOne({
            attributes: [["wc_status","status"],["wc_start_time","start-time"]],
            where: {
                level: level
            }
        })
        const we = await db.Level.findOne({
            attributes: [["we_status","status"],["we_start_time","start-time"]],
            where: {
                level: level
            }
        })
        const dc = await db.Level.findOne({
            attributes: [["dc_status","status"],["dc_start_time","start-time"]],
            where: {
                level: level
            }
        })
        const de = await db.Level.findOne({
            attributes: [["de_status","status"],["de_start_time","start-time"]],
            where: {
                level: level
            }
        })
        const machines = [wc,we,dc,de]
        const machines_names = ["washer-coin","washer-ezlink","dryer-coin","dryer-ezlink"]
        for (let i = 0; i < 4; i++) {
            const machine = machines[i]
            const datavalues = machine.dataValues;
            // respData.push(datavalues)
            
            const resp = {
                ...datavalues,
                level: 5,
                time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                type: machines_names[i]
            }
            respData.push(resp)
        }
        res.send(respData)
    } catch(err) {
        res.send(err.name)
    }
    
})

router.get('/levels/:level/charts', (req,res) => {
    let respData = {}
    db.Level.findOne({
        where: {
            level: req.params.level
        },
        attributes: ["mon","tue","wed","thu","fri","sat","sun"]
    })
    .then(resp => {
        const data = resp.dataValues;
        Object.keys(data).forEach(key => {
            const intlist = data[key].split(",").map(x => parseInt(x, 10));
            respData[key] = intlist
        })
        res.send(respData)
    })
    .catch(err => {
        res.send(err.name)
    })
})

router.post('/update', async (req,res) => {
    let {floor,data} = req.body
    try {
        let current=await db.Level.findOne({
            attributes:["current"],
            where:{
                level:floor
            }
        })
        current=current.dataValues.current

        let statuses=Array.from(data).map(x => parseInt(x, 10))
        if(current[0]==0 && statuses[0]==1){
            await db.Level.update({
                wc_start_time:moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            },{
                where:{
                    level:floor
                }
            })
        }
        if(current[1]==0 && statuses[1]==1){
            await db.Level.update({
                we_start_time:moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            },{
                where:{
                    level:floor
                }
            })
        }
        if(current[2]==0 && statuses[2]==1){
            await db.Level.update({
                dc_start_time:moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            },{
                where:{
                    level:floor
                }
            })
        }
        if(current[3]==0 && statuses[3]==1){
            await db.Level.update({
                de_start_time:moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            },{
                where:{
                    level:floor
                }
            })
        }
        let respdata= await db.Level.update({
            wc_status: parseInt(data.charAt(0)),
            we_status: parseInt(data.charAt(1)),
            dc_status: parseInt(data.charAt(2)),
            de_status: parseInt(data.charAt(3)),
            current: Array.from(data).map(x => parseInt(x, 10))
        },{
            where: {
                level: floor
            },
            returning: true,
            plain: true
        })

        res.send(respdata)
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router;
