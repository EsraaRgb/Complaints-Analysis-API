const { DataTypes } = require("sequelize")
const { sequelize } = require("../connection")

const UserModel = sequelize.define(
    "user",
    {
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            isEmail: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        confirmedEmail: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        nationalId: {
            type: DataTypes.STRING(14),
            allowNull: false,
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM("male", "female"),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        profilePic:{
            type:DataTypes.STRING(),
            defaultValue:"Null"
        },
        City: {
            type: DataTypes.STRING(255),
        }
    },
    {
        timestamps: true,
    }
)

module.exports = UserModel
