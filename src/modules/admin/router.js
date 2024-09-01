const express=require ("express");
const route= express.Router();
const employeesModel=require("../../../DB/models/employee.model")
const userModel=require("../../../DB/models/user.model")
const auth= require("../../middlewares/auth")
const roles=require("../../services/roles")
// const AdminModel = require("../../../DB/models/admin.model");

// route.get("/",async(req,res)=>{
//     const admins= await AdminModel.findAll();
//     res.send(admins);
// });

route.delete("/deleteEmployee/:id",auth([roles.admin]),async (req,res)=>{
    const employee = await employeesModel.findOne({ where: { id: req.params.id } })
    const deleted_employee= await employeesModel.destroy({
        where: {
            id: req.params.id
        }
    });
    const deleted_user= await userModel.destroy({
        where: {
            id: employee.userId
        }
    });
    res.status(200).json({message:"The employee deleted successfully"})
});

module.exports= route;
