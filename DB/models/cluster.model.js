const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")

const clusterModel = sequelize.define(
    "cluster",
    {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        popularWords: {
            type: DataTypes.STRING(255),
        },
    },
    {
        timestamps: true,
    }
)

module.exports = clusterModel
