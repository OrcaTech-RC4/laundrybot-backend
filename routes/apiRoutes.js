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
});

router.get('/levels',(req,res)=>{
    let respData={};
    try{
        respData.success=true;
        respData.levels=[5,8,11,14,17]
        res.send(respData);
    }catch(err){
        respData.success=false
        respData.message=err.name
        res.send(respData)
    }   
})

router.get('/levels/:level/statuses',async (req,res)=>{
    let respData=[]
    try{
        const level=req.params.level
        const wc= await db.Level.findOne({
            attributes:[["wc_status","status"],["wc_start_time","start-time"]],
            where:{
                level:level
            }
        })
        const we= await db.Level.findOne({
            attributes:[["we_status","status"],["we_start_time","start-time"]],
            where:{
                level:level
            }
        })
        const dc= await db.Level.findOne({
            attributes:[["dc_status","status"],["dc_start_time","start-time"]],
            where:{
                level:level
            }
        })
        const de= await db.Level.findOne({
            attributes:[["de_status","status"],["de_start_time","start-time"]],
            where:{
                level:level
            }
        })
        const machines=[wc,we,dc,de]
        const machines_names=["washer-coin","washer-ezlink","dryer-coin","dryer-ezlink"]
        for(let i=0;i<4;i++){
            let machine=machines[i]
            let datavalues=machine.dataValues;
            // respData.push(datavalues)
            
            let resp={
                ...datavalues,
                level:5,
                time:moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                type:machines_names[i]
            }
            respData.push(resp)
        }
        res.send(respData)
    }catch(err){
        res.send(err.name)
    }
    
})

router.get('/levels/:level/charts',(req,res)=>{
    let respData={}
    db.Level.findOne({
        where:{
            level:req.params.level
        },
        attributes:["mon","tue","wed","thu","fri","sat","sun"]
    })
    .then(resp=>{
        const data=resp.dataValues
        Object.keys(data).forEach(key=>{
            let str=data[key].split(",")
            respData[key]=str
        })
        res.send(respData)
    })
    .catch(err=>{
        res.send(err.name)
    })
})

router.post('/update',(req,res)=>{
    let {floor,data} =req.body
    db.Level.update({
        wc_status:parseInt(data.charAt(0)),
        we_status:parseInt(data.charAt(1)),
        dc_status:parseInt(data.charAt(2)),
        de_status:parseInt(data.charAt(3))
    },{
        where:{
            level:floor
        },
        returning:true,
        plain:true
    }).then(respData=>{
        res.send(respData)
    }).catch(err=>{
        res.send(err.name)
    })
    
})




module.exports = router;
