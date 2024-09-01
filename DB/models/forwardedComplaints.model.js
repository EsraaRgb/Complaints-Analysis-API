const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")
const ForwardedComplaintsModel = sequelize.define(
    "forwardedComplains",
    {
        reason: {
            type: DataTypes.STRING(50),
        },
        decision: {
            type: DataTypes.BOOLEAN,
        },
        oldSector:{
            type:DataTypes.STRING(50)
        },
        newSector:{
            type:DataTypes.STRING(50)
        }
    },
    {
        timestamps: true,
    }
)
module.exports = ForwardedComplaintsModel