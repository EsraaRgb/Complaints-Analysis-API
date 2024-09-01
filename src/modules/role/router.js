const express=require ("express");
const router= express.Router();
const roleModel = require("../../../DB/models/role.model");

router.get("/",async(req,res)=>{
    const role= await roleModel.findAll();
    res.send(role);
});

module.exports= router;


