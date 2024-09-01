const express=require ("express");
const router= express.Router();
const citizenModel = require("../../../DB/models/citizen.model");
const userModel=require("../../../DB/models/user.model")
const citizenController=require("./citizen.controller")
const auth= require("../../middlewares/auth")
const roles =require("../../services/roles")

router.get("/",auth([roles.citizen]), citizenController.citizens)
router.delete("/delete",auth(),citizenController.deleteCitizen)


module.exports= router;