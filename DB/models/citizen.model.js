const { sequelize } = require("../connection")
const CitizenModel = sequelize.define(
    "citizen",
    {},
    {
        timestamps: true,
    }
)

module.exports = CitizenModel
