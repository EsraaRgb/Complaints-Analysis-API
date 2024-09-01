const express=require ("express");
const router= express.Router();
const sectorsModel = require("../../../DB/models/sector.model");


router.get("/",async(req,res)=>{
    const sectors= await sectorsModel.findAll();
    res.send(sectors);
});

module.exports= router;