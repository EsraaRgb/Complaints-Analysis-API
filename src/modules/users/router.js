const express = require("express")
const router = express.Router()
const userController = require("./user.controller.js")
const validate = require("../../middlewares/validation.js")
const validationSchemas = require("./validation.js")
const auth = require("../../middlewares/auth.js")
const roles = require("../../services/roles.js")
const {myMulter,HME,fileValidation} = require("../../services/multer.js")
router.get("/", async (req, res) => {
    // const citizens = await UserModel.findAll()
    // res.send(citizens)
})

router.post("/signup/citizen",validate(validationSchemas.signup), userController.signup )
router.post("/signup/employee",validate(validationSchemas.employeeSignup),userController.employeeSignup)
router.get("/confirmEmail/:token",validate(validationSchemas.paramsToken),userController.confirmEmail)
router.get("/getUsers/:type",userController.getUsers)

router.post("/login", validate(validationSchemas.login),userController.login)
router.get("/profile",validate(validationSchemas.authToken), auth([roles.admin, roles.citizen, roles.employee]),userController.getUserProfile)
router.put("/update",auth(roles.citizen,roles.employee),myMulter(fileValidation.image).single('image'),HME,userController.updateUser)




module.exports = router
