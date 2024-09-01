const express = require("express");
const route = express.Router();
const ForwardedComplaintsController = require("./forwardedComplaints.controller.js")
const auth = require("../../middlewares/auth")
const roles = require("../../services/roles")

route.get("/", auth([roles.employee, roles.admin]), ForwardedComplaintsController.forwardedComplaints)
route.get("/ForwaredTable/table", ForwardedComplaintsController.FCTable)
route.get("/ForwaredTable/tableChart", ForwardedComplaintsController.FCChart)
// route.get("/ForwaredTable/:name", ForwardedComplaintsController.handelForwaredTableInAdmin)
route.get("/countForwaredComplaintsInSector", ForwardedComplaintsController.countForwaredComplaintsInSector)

route.get("/employeeForwardedComplaints", auth([roles.employee, roles.admin]), ForwardedComplaintsController.getEmployeeForwardedComplaints)
route.put("/update/:id", auth([roles.admin]), ForwardedComplaintsController.updateForwardedComplaints)
route.post("/:id", auth([roles.employee]), ForwardedComplaintsController.addForwardedComplaints)


module.exports = route;