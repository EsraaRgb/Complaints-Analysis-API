const complainTagsModel=require("../../../DB/models//complaintTag.model")





const getComplainTags=async (req,res)=>{
    try{
        const complainTags=await complainTagsModel.findAll();
        res.send(complainTags);
    }catch(error){
        res.status(500).json({message:"catch an error"})
    }
  
}

const addComplainTags=async (req,res)=>{
    try{
        const addComplainTags=await complainTagsModel.create({
            complaintId:req.body.complaintId,
            tagId:req.body.tagId,
        })
        res.status(200).json({message:"Done",addComplainTags})

    }catch(error){
        res.status(500).json({message:"catch an error"})
    }
}



module.exports={
    getComplainTags,
    addComplainTags,
}