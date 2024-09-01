const joi = require('joi')


const signup = {
    body: joi.object().required().keys({
        firstName: joi.string().min(3).max(20).required(),
        lastName: joi.string().min(3).max(20).required(),
        email: joi
            .string()
            .email({ tlds: { allow: ["com", "edu", "net", "org","eg"] } })
            .required(),
        password: joi
            .string()
            .required(),
        address: joi.string(),
        nationalId: joi.string().min(14).max(14),
        phone: joi.string().min(11).max(11),
        birthdate: joi.date().required(), // enter date with this format "YY-MM-DD"
        gender: joi.string().equal("female", "male"),
        City: joi.string(),
    })
}
const employeeSignup = {
    body: joi.object().required().keys({
        firstName: joi.string().min(3).max(20).required(),
        lastName: joi.string().min(3).max(20).required(),
        email: joi
            .string()
            .email({ tlds: { allow: ["com", "edu", "net", "org"] } })
            .required(),
        password: joi
            .string()
            .required(),
        address: joi.string(),
        nationalId: joi.string().min(14).max(16),
        phone: joi.string().min(11).max(11),
        birthdate: joi.date(),
        gender: joi.string().equal("female", "male"),
        City: joi.string().required(),
        sectorId: joi.string().required()
    })
}
const login = {
    body: joi.object().required().keys({
        email: joi
            .string()
            .email({ tlds: { allow: ["com", "edu", "net", "org"] } })
            .required(),
        password: joi
            .string()
            .required()
    }).options({ allowUnknown: false })
}

const paramsToken = {

    params: joi.object().required().keys({
        token: joi.string().required(),
    })
}
const authToken = {
    headers: joi.object().required().keys({
        authorization: joi.string().required(),
    }).unknown(true),
}

module.exports = {
    signup, login, employeeSignup, paramsToken, authToken
}