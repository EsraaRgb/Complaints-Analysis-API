const express=require ("express");
const router= express.Router();
const CommentController = require("./comment.controller.js");
const roles = require("../../services/roles.js")
const auth = require("../../middlewares/auth.js")
const validate = require("../../middlewares/validation")
const validationSchemas = require("./validation.js")
const {authToken} = require ("../users/validation.js")
const {myMulter,HME,fileValidation} = require("../../services/multer.js")


router.use(validate(authToken));
router.get("/",auth([roles.citizen]), CommentController.getComment)
router.post("/:id",myMulter(fileValidation.image).single('attachment'),HME,validate(validationSchemas.addComment),auth([roles.citizen,roles.employee]),CommentController.addComment);

module.exports= router;