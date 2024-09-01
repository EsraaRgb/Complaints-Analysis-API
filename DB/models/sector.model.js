const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")
const SectorModel = sequelize.define(
    "sector",
    {
        name: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
        },
    },
    {
        timestamps: true,
    }
)

module.exports = SectorModel
