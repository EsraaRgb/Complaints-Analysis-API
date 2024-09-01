const express=require ("express");
const TagModel = require("../../../DB/models/tag.model");
const router= express.Router();


router.get("/",async(req,res)=>{
    try{
        const tags= await TagModel.findAll();
        res.status(200).json({message:"Done",tags})
    }catch(error){
        res.status(500).json({message:"catch an error"})
    }
    
});


router.post("/add",async(req,res)=>{
    try{
        const tags=await TagModel.create({
            name:req.body.name,
        })
        res.status(200).json({message:"Done",tags})
    }catch(error){
        res.status(500).json({message:"catch an error"})
    }
   
})

router.get("/countComplaintsInTags/:name",async (req,res)=>{
    try{
        const { sequelize } = require("../../../DB/connection.js")
        const { QueryTypes } = require('sequelize');
    
        const query = `
        select  tags.name , COUNT(complaints.id) AS complaint_count
        from complaints,complainttags,tags, sectors , complaintdetails
        where complaints.id=complainttags.complaintId and complaints.id=complaintdetails.complaintId and complainttags.tagId=tags.id and sectors.id=complaintdetails.sectorId and sectors.name='${req.params.name}'
        GROUP BY tags.name;
    `;
    
    
        const complains = await sequelize.query(query, { type: QueryTypes.SELECT });
        // console.log(complaint);
        res.send(complains);
    }catch(error){
        res.status(500).json({message:"catch an error"})
    }
})

module.exports= router;