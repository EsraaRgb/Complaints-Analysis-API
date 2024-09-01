const forwardedComplaintsModel = require("../../../DB/models/forwardedComplaints.model")
const employeeModel = require("../../../DB/models/employee.model")
const ComplaintModel = require("../../../DB/models/complaint.model")
const complaintDetails = require("../../../DB/models/complaintDetails.model")
const userModel = require("../../../DB/models/user.model")
const { sequelize } = require("../../../DB/connection.js")
const { Sequelize, DataTypes, Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const SectorModel = require("../../../DB/models/sector.model")
const { body } = require("../cluster/validation")
const forwardedComplaints = async (req, res) => {
  try {
    const forwardedComplaints = await forwardedComplaintsModel.findAll()
    res.status(200).json({ message: "Done", forwardedComplaints })
  } catch (error) {
    res.status(500).json({ message: "catch an error" })
  }
}




const FCTable = async (req, res) => {
  try {
    const FC = await forwardedComplaintsModel.findAll({
      where: { decision: null },
      include: [{ model: employeeModel, attributes: ['id'], include: [{ model: userModel, attributes: ['firstName', 'lastName'] }] },
      {
        model: ComplaintModel, attributes: ['id', 'body', 'state']
      }]
    })
    let response = []
    if (FC.length == 0) {
      return res.json(response)
    }
    else {
      for (const complaint of FC) {
        complaint.decision = complaint.decision == 1 ? 'مقبول' : complaint.decision == 0 ? 'مرفوض' : 'غير محدد'
        //complaint.complaint.state = complaint.complaint.state == 'delivered' ? 'تم التسليم' : complaint.complaint.state == 'completed' ? 'تم الحل' : complaint.complaint.state == 'need-action' ? 'جاري العمل' : 'مشاهده'
        let obj = {
          id: complaint.id,
          complaintId: complaint.complaintId,
          body: complaint.complaint.body,
          firstName: complaint.employee.user.firstName,
          lastName: complaint.employee.user.lastName,
          decision: complaint.decision,
          reason: complaint.reason,
          state: complaint.complaint.state,
          newSector: complaint.newSector,
          oldSector: complaint.oldSector,
          createdAt: Date(complaint.createdAt)
        }
        response.push(obj)
      }
    }
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: "catch an error" })
  }
}

const FCChart = async (req, res) => {
  try {
    const FC = await forwardedComplaintsModel.findAll({
      where: { decision: { [Op.in]: [0, 1] } },
      include: [{ model: employeeModel, attributes: ['id'], include: [{ model: userModel, attributes: ['firstName', 'lastName'] }] },
      {
        model: ComplaintModel, attributes: ['id', 'body', 'state']
      }]
    })
    let response = []
    if (FC.length == 0) {
      return res.json(response)
    }
    else {
      for (const complaint of FC) {
        complaint.decision = complaint.decision == 1 ? 'مقبول' : complaint.decision == 0 ? 'مرفوض' : 'غير محدد'
        //complaint.complaint.state = complaint.complaint.state == 'delivered' ? 'تم التسليم' : complaint.complaint.state == 'completed' ? 'تم الحل' : complaint.complaint.state == 'need-action' ? 'جاري العمل' : 'مشاهده'
        let obj = {
          id: complaint.id,
          complaintId: complaint.complaintId,
          body: complaint.complaint.body,
          firstName: complaint.employee.user.firstName,
          lastName: complaint.employee.user.lastName,
          decision: complaint.decision,
          reason: complaint.reason,
          state: complaint.complaint.state,
          newSector: complaint.newSector,
          oldSector: complaint.oldSector,
          createdAt: Date(complaint.createdAt)
        }
        console.log(obj.decision);
        response.push(obj)
      }
    }
    console.log(response);
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: "catch an error" })
  }
}
const getEmployeeForwardedComplaints = async (req, res) => {
  try {
    const employee = await employeeModel.findOne({ where: { userId: req.user.id } })
    const forwardedComplaints = await forwardedComplaintsModel.findAll({
      where: {
        employeeId: employee.id
      }
    })
    res.status(200).json({ message: "Done", forwardedComplaints })
  } catch (error) {
    res.status(500).json({ message: "catch an error" })
  }
}

const addForwardedComplaints = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await employeeModel.findOne({ where: { userId: req.user.id } })
    const sector = await SectorModel.findOne({ where: { id: employee.sectorId } })
    if (!employee) {
      return res.status(404).json({ message: "employee not found" })
    }
    const complaint = await ComplaintModel.findOne({
      where: { id }, include: [{
        model: complaintDetails,
        attributes: ["sectorId"]
      }]
    })
    if (!complaint) {
      return res.status(404).json({ message: "complaint not found" })
    }
    if (!complaint.complaintDetails[0] || complaint.complaintDetails[0].sectorId !== employee.sectorId) {
      return res.status(404).json({ message: "you can't forward complaint not in your sector" })
    }
    const forwardedComplaints = await forwardedComplaintsModel.findOne({ where: { complaintId: complaint.id, oldSector: sector.name } })
    if (forwardedComplaints) {
      return res.status(404).json({ message: "forward complaint request already created" })
    }
    const addForwardedComplaints = await forwardedComplaintsModel.create({
      reason: req.body.reason,
      complaintId: complaint.id,
      oldSector: sector.name,
      employeeId: employee.id,
    })
    res.status(200).json({ message: "Done", addForwardedComplaints })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "catch an error" })
  }

}

const countForwaredComplaintsInSector = async (req, res) => {
  try {

    const query = `
    SELECT 
    sectors.name  AS oldSector,
      
      COUNT(forwardedComplains.complaintId) AS complaintCount
    FROM sectors
    LEFT JOIN forwardedComplains ON forwardedComplains.oldSector = sectors.name
    GROUP BY sectors.name;
  `;


    const sentiments = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log(complaint);
    res.send(sentiments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", err: error.toString() });
  }
}

const updateForwardedComplaints = async (req, res) => {
  try {
    const updateForwardedComplaints = await forwardedComplaintsModel.update({
      decision: req.body.decision,
      oldSector: req.body.oldSector,
      newSector: req.body.newSector,
      employeeId: req.body.employeeId
    },
      {
        where: {
          complaintId: req.params.id,

        }
      })

    res.status(200).json({ message: "record updated successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "catch an error" })
  }
}
module.exports = {
  forwardedComplaints,
  addForwardedComplaints,
  updateForwardedComplaints,
  getEmployeeForwardedComplaints,
  countForwaredComplaintsInSector,
  FCTable,
  FCChart
}
