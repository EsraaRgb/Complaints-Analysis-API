const express=require ("express");
const router= express.Router();
const clusterController=require("./cluster.controller")
const auth=require("../../middlewares/auth")
const roles=require("../../services/roles")
const saveClusters=require("./validation")
const validate = require('../../middlewares/validation.js')

router.get("/",clusterController.getClusters)
router.get("/sectorClusters/:name",clusterController.getSectorsClusters)
router.post("/add",auth(),clusterController.addCluster)
router.put("/update/:id",auth([roles.admin]),clusterController.updateCluster)
router.delete("/delete/:id",auth([roles.admin]),clusterController.deleteCluster)

router.post("/confirm",auth([roles.employee]),validate(saveClusters),clusterController.createClusters)


module.exports= router;


