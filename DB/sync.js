const RoleModel = require("./models/role.model")
const UserModel = require("./models/user.model.js")
const AdminModel = require("./models/admin.model.js")
const CitizenModel = require("./models/citizen.model.js")
const EmployeeModel = require("./models/employee.model.js")
const ComplaintModel = require("./models/complaint.model.js")
const SectorModel = require("./models/sector.model.js")
const ComplaintHistoryModel = require("./models/complaintHistory.model.js")
const TagModel = require("./models/tag.model.js")
const ForwardedComplaintsModel = require("./models/forwardedComplaints.model.js")
const complaintDetails = require("./models/complaintDetails.model")
const clusterModel = require("./models/cluster.model")
const CommentModel = require("./models/comment.model")

RoleModel.hasMany(UserModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
UserModel.belongsTo(RoleModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

UserModel.hasOne(AdminModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
AdminModel.belongsTo(UserModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

UserModel.hasOne(CitizenModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
CitizenModel.belongsTo(UserModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

UserModel.hasOne(EmployeeModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
EmployeeModel.belongsTo(UserModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

CitizenModel.hasMany(ComplaintModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
ComplaintModel.belongsTo(CitizenModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})


SectorModel.hasMany(EmployeeModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
EmployeeModel.belongsTo(SectorModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

ComplaintModel.hasMany(ComplaintHistoryModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
ComplaintHistoryModel.belongsTo(ComplaintModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

ComplaintModel.hasOne(ForwardedComplaintsModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
ForwardedComplaintsModel.belongsTo(ComplaintModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

EmployeeModel.hasOne(ComplaintModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
ComplaintModel.belongsTo(EmployeeModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

EmployeeModel.hasMany(ForwardedComplaintsModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
ForwardedComplaintsModel.belongsTo(EmployeeModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
ComplaintModel.hasMany(complaintDetails, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
complaintDetails.belongsTo(ComplaintModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
complaintDetails.hasOne(ComplaintModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
ComplaintModel.belongsTo(complaintDetails, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
SectorModel.hasMany(complaintDetails, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
complaintDetails.belongsTo(SectorModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

clusterModel.hasMany(complaintDetails, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
})
complaintDetails.belongsTo(clusterModel, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
})

SectorModel.hasMany(clusterModel, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
})
clusterModel.belongsTo(SectorModel, {
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
})

ComplaintModel.hasMany(CommentModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
CommentModel.belongsTo(ComplaintModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

const syncTables = async () => {
    await RoleModel.sync({ alter: true })
    await UserModel.sync({ alter: true })
    await CitizenModel.sync({ alter: true })
    await EmployeeModel.sync({ alter: true })
    await ComplaintModel.sync({ alter: true })
    await CommentModel.sync({ alter: true })
    await ComplaintModel.sync({ alter: true })
    await SectorModel.sync({ alter: true })
    await TagModel.sync({ alter: true })
    await ComplaintHistoryModel.sync({ alter: true })
    await ForwardedComplaintsModel.sync({ alter: true })
    await clusterModel.sync({ alter: true })
    await complaintDetails.sync({ alter: true })
}



module.exports = syncTables