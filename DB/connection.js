const { Sequelize } = require("sequelize")

const sequelize = new Sequelize({
    host: "test.cpikuoa6u0aq.eu-north-1.rds.amazonaws.com",
    dialect: "mysql",
    username: "admin",
    password: "gcpdbadmin",
    database: "gcp",
    logging: false,
})

const drawTables = async () => {
    return await sequelize
        .sync({ alter: true })
        .then((result) => {
            console.log(`connected To DB ....`)
        })
        .catch((err) => {
            console.log(`Failed To connect DB ....`)
        })

}

module.exports = { sequelize, drawTables }

