const { DataTypes } = require("sequelize")
const {sequelize} = require("../connection")
const TagModel = require("./tag.model")
const ComplaintModel = require("./complaint.model")
const ComplaintTagModel = sequelize.define("ComplaintTag", {})
ComplaintModel.belongsToMany(TagModel, { through: ComplaintTagModel })
TagModel.belongsToMany(ComplaintModel, { through: ComplaintTagModel })


module.exports = ComplaintTagModel