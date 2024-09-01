const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")
const ComplaintHistoryModel = sequelize.define(
    "complaintHistory",
    {
        state: {
            type: DataTypes.ENUM("delivered", "viewed", "need-action", "completed"),
            defaultValue: "delivered",
            allowNull: false
        },
        previousState: {
            type: DataTypes.ENUM("delivered", "viewed", "need-action", "completed"),
            defaultValue: "delivered",
            // allowNull:true
        },
    },
    {
        timestamps: true,
    }
)
module.exports = ComplaintHistoryModel