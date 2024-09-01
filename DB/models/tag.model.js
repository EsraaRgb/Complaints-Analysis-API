const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")
// const EmployeeModel = require('./employee.model')
const TagModel = sequelize.define(
    "tag",
    {
        name: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
)
module.exports = TagModel
