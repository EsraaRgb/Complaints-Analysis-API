const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")
const ComplaintModel = require("./complaint.model")
const CommentModel = sequelize.define(
    "comment",
    {
        body: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        attachments: {
            type: DataTypes.STRING(255),
        },
        senderID: {
            type: DataTypes.STRING(50)
        },
        reciverID: {
            type: DataTypes.STRING(50)
        },
    },
    {
        timestamps: true,
    }
)
module.exports = CommentModel
