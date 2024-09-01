const RoleModel = require("../../../DB/models/role.model.js")
const AdminModel = require("../../../DB/models/admin.model.js")
const userModel = require("../../../DB/models/user.model.js")
const bcrypt = require("bcryptjs")
const createRoles = async () => {
    try {
        const roles = await RoleModel.findAll({})
        if (roles.length == 0) {
            const createdRoles = await RoleModel.bulkCreate([{ name: 'admin' }, { name: "citizen" }, { name: 'employee' }])
            console.log("Roles has been Created Successfully");
        }
        else console.log("Roles Already Created ");
    } catch (error) { }

}

const createAdmin = async () => {
    try {
        const admins = await AdminModel.findAll({})        
        if (admins.length == 0) {
            const hashedPassword = await bcrypt.hash("admin", parseInt(process.env.SALTROUND));
            const user = await userModel.create({
                firstName: "admin",
                lastName: "admin",
                email: "complainsportal@gmail.com",
                password: hashedPassword,
                confirmedEmail: true,
            })
            console.log("user", user);
            const role = await AdminModel.create({ userId: user.id,
                roleId: 1 
            })            
            console.log("Admin has been Created Successfully");
        }
        else console.log("Admin Already Created ");
    } catch (error) { }

}

module.exports = {createRoles, createAdmin}