const jwt = require("jsonwebtoken")
const RoleModel = require("../../DB/models/role.model")
const UserModel = require("../../DB/models/user.model")
const auth = (roles = ["citizen"]) => {
    return async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                return res.json({ message: "authorization token is requiered" })
            }
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.jwtSecret)
            if (decoded && decoded.roleId) {
                const role = await RoleModel.findOne({ where: { id: decoded.roleId } })
                if (roles.includes(role.name)) {
                    const user = await UserModel.findOne({ where: { id: decoded.id } })
                    if (user) {
                        req.user = user
                        next()
                    } else {
                        res.json({ message: "In-valid user Id" })
                    }
                } else {
                    res.json({ message: "Un-Authorized User" })
                }
            } else {
                res.json({ message: "In-valid Token" })
            }
        } catch (error) {

            res.json({ message: "catch error" , error: error.message})
        }
    }
}

module.exports = auth
