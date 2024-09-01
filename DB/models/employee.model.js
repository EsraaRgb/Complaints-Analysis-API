const { sequelize } = require("../connection")

const EmployeeModel = sequelize.define(
    "employee",
    {},
    {
        timestamps: true,
    }
)

module.exports = EmployeeModel
