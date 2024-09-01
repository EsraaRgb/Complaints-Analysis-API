const citizenModel=require("../../../DB/models/citizen.model")
const userModel =require("../../../DB/models/user.model")


const citizens =async (req,res)=>{
    try{
        const citizens= await citizenModel.findAll();
        res.send(citizens);
    }catch(error){
        res.status(500).json({ message: "catch error" });
    }
};

const deleteCitizen= async (req,res)=>{
    try{
      
        const citizen = await citizenModel.findOne({ where: { userId: req.user.id } })
        const deleted_citizen= await citizenModel.destroy({
            where: {
                id: req.user.id
            }
    });
    const deleted_user= await userModel.destroy({
        where: {
            id: citizen.userId
        }
    });
    res.status(200).json({message:"The citizen deleted successfully"})

    }catch(error){
        res.status(500).json({message:"catch error"});
    }

};


module.exports={
    citizens,
    deleteCitizen,

};


