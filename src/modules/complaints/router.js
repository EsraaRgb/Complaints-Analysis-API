const express = require("express")
const router = express.Router({ mergeParams: true })
const roles = require("../../services/roles.js")
const auth = require("../../middlewares/auth.js")
const validate = require("../../middlewares/validation")
const complaintController = require("./complaintController.js")
const validationSchemas = require("./validation.js")
const { authToken } = require("../users/validation.js")
//router.use(validate(authToken));

router.get("/", complaintController.complaints)
// router.get("/admin", complaintController.getComplaintsForAdmin)

router.get("/dashboard", auth([roles.employee]), complaintController.getDashboardData)
router.put('/changeState/:id', validate(validationSchemas.changeState), auth([roles.employee]), complaintController.changeComplaintState)
router.get("/employee", auth([roles.employee]), complaintController.getEmployeeComplaints)
router.get("/history", auth([roles.citizen]), complaintController.getCitizenComplaints)
router.get("/sector", auth([roles.employee]), complaintController.getEmployeeSectorComplaints)
router.get("/getDate", complaintController.foundDate)
router.get("/cardsCount", complaintController.cardsCountInAdmin)
router.get("/countsForSectorPageAdmin", complaintController.countsForSectorPageAdmin)
router.get("/countofComplaintsInMonths/:name", complaintController.countofComplaintsInMonths)

router.post("/add", validate(validationSchemas.addComplaint), auth([roles.citizen]), complaintController.addComplaint)
router.put("/update/:id", auth([roles.citizen, roles.employee]), complaintController.updateComplaint)
router.delete("/delete/:id", auth([roles.admin]), complaintController.deleteComplaint)
router.get("/heatMapQAuery/:year",complaintController.heatMapQAuery)
router.get("/sentiment/:sector",complaintController.sentiment)

router.get("/search", auth([roles.admin]), complaintController.searchComplaints)//for admin
router.get("/search/sector", auth([roles.employee]), complaintController.searchSectorComplaints)//for Employee
router.get("/cluster/sector", auth([roles.employee]), complaintController.clusterSectorComplaints)
router.get("/cluster", auth([roles.employee]), complaintController.clusterComplaints)
router.post("/analysis", auth([roles.employee]), complaintController.analyzeComplaints)
router.post("/summary", complaintController.summarizeComplaints)
router.get("/:id", auth([roles.citizen, roles.employee, roles.admin]), complaintController.getComplaintById)


module.exports = router
