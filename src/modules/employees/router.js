const express=require ("express");
const router= express.Router();
const employeesModel = require("../../../DB/models/employee.model");
const auth= require("../../middlewares/auth")
const roles=require("../../services/roles")

//const employeesController = require("./employee.controller");
const validate = require("../../middlewares/validation")
//const schemas = require("./validation")

//const validate = require("../../middlewares/validation")

const {authToken} = require ("../users/validation.js")
const ComplaintRouter = require ('../complaints/router.js')
router.use(validate(authToken));

router.get("/",async(req,res)=>{
    const employees= await employeesModel.findAll();
    res.send(employees);
});

router.use('/home',ComplaintRouter)

module.exports= router;