const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")
const RoleModel = sequelize.define(
    "role",
    {
        name: {
            type: DataTypes.ENUM("admin", "citizen", "employee"),
        },
        description: {
            type: DataTypes.STRING(255),
        },
    },
    {
        timestamps: true,
    }
)
// Reminder -> when Querying table with foreign keys we can use include [{ model: modelName, attributes:['attribute1','attribute2']}]

module.exports = RoleModel
