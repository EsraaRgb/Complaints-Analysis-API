const { DataTypes, Sequelize } = require("sequelize")
const { sequelize } = require("../connection")
const ComplaintModel = sequelize.define(
    "complaint",
    {
        title: {
            type: DataTypes.STRING(255),
            defaultValue: "بلا عنوان",
        },
        body: {
            type: DataTypes.STRING(255),
        },
        sentiment: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // until the ML model predict that it's a complain
        },
        attachments: {
            type: DataTypes.STRING(255),
        },
        state: {
            type: DataTypes.ENUM("delivered", "viewed", "need-action", "completed"),
            defaultValue: "delivered",
        },
        endDate: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        embedding: {
            type: DataTypes.TEXT,
            defaultValue: null,
        },
    },
    {
        timestamps: true, // createdAt -> start date , updatedAt -> end date if the state is completed or the last update date if not completed
    }
)
// foreign keys -> citizenId, sectorId, employeeId, -> would be created at the other tables
//another relations -> issueTag, issueHistory would be created here after creating other tables


module.exports = ComplaintModel


