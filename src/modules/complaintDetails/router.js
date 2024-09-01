const express=require ("express");
const router= express.Router();
const ComplaintDetailsModel = require("../../../DB/models/complaintDetails.model");
const complainDetailsController=require("./complainDetails.controller")
const auth =require("../../middlewares/auth")
const roles =require("../../services/roles")


router.get("/",auth([roles.citizen,roles.employee]),complainDetailsController.allComplainDetails)
router.get("/complainsInSector/:name",complainDetailsController.countComplainsInSector)
router.get("/ComplaintsCounts",complainDetailsController.complaintsCount)

router.get("/complainsOfClustersInSector/:name",complainDetailsController.countComplainsForClusterInSectors)
router.get("/complainsInClusters/:name",complainDetailsController.countComplainsInClusters)
router.get("/sectorName/:name",complainDetailsController.getSector)
router.post("/add",auth(roles.citizen,roles.employee),complainDetailsController.addComplainDetails)
router.put("/update/:id/:name",auth([roles.admin]),complainDetailsController.update)

module.exports = router