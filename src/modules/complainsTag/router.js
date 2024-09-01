const express=require ("express");
const router= express.Router();
const complainTagsController=require("./complainTags.controller")
const roles=require("../../services/roles")
const auth=require("../../middlewares/auth")


router.get("/",auth([roles.employee]),complainTagsController.getComplainTags)
router.post("/add",auth([roles.employee]),complainTagsController.addComplainTags)

module.exports= router;