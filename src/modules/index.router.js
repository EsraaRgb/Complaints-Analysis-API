const express = require("express");
const cors = require("cors");
const { drawTables } = require("../../DB/connection.js");
const syncTables = require("../../DB/sync.js");
const {createRoles, createAdmin} = require("../modules/role/role.js");
const createSectors = require("../modules/sectors/sector.controller.js");
const { tagComplaints } = require("./complaints/complaintController.js");
const cronJob = require("node-schedule");
const corsOptions = {
  origin: "*",
};

const appRouter = async (app) => {
  app.use(express.json());
  app.use(cors());
  app.use("/roles", require("./role/router.js"));
  app.use("/users", require("./users/router"));
  app.use("/admins", require("./admin/router"));
  app.use("/employee", require("./employees/router"));
  app.use("/citizens", require("./citizen/router"));
  app.use("/sectors", require("./sectors/router"));
  app.use("/tags", require("./tags/router"));
  app.use("/complaints", require("./complaints/router"));
  app.use("/comments", require("./comment/router"));
  app.use("/complaintsHistory", require("./complaintsHistory/router"));
  app.use("/complaintsTag", require("./complainsTag/router.js"));
  app.use("/forwardedComplaints", require("./forwardedComplaints/router.js"));
  app.use("/clusters", require("./cluster/router.js"));
  app.use("/complaintDetails", require("./complaintDetails/router.js"));
  app.use("*", (req, res, next) => {
    next(
      new Error("In-valid Routing Plz check url  or  method", { cause: 404 })
    );
    res.status(404).json({ message: "In-valid Routing Plz check url  or  method" });
  });
  await drawTables();
  await syncTables().catch((err) => { });
  createRoles();
  createAdmin();
  createSectors();
  // Tag complaints every 21 days -> 3 weeks
  //tagComplaints();
  const job = cronJob.scheduleJob('*/21 * *', tagComplaints)
}
module.exports = appRouter;
