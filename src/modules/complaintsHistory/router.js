const express=require ("express");
const router= express.Router();
const ComplaintHistoryModel = require("../../../DB/models/complaintHistory.model");

router.get("/",async(req,res)=>{
    const complaintHistory= await ComplaintHistoryModel.findAll();
    res.send(complaintHistory);
});

module.exports= router;