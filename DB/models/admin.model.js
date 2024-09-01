const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")
const AdminModel = sequelize.define("admin",
    {
        title: {
            type: DataTypes.STRING(100), // Could be enum of admin hierarchy
        },
    },
    {
        timestamps: true,
    }
)

module.exports = AdminModel