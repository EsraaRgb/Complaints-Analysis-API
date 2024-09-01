const UserModel = require("../../../DB/models/user.model");
const RoleModel = require("../../../DB/models/role.model");
const CitizenModel = require("../../../DB/models/citizen.model");
const EmployeeModel = require("../../../DB/models/employee.model");
const Role = require("../../../DB/models/role.model")
const sectors = require("../../../DB/models/sector.model")
const cloudinary = require('../../services/cloudinary')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/email");
const { sequelize } = require("../../../DB/connection.js")
const Sequelize = require('sequelize');
const employee = require("../../../DB/models/employee.model");

const getUsers = async (req, res) => {
  try {
    var query = ''
    if (req.params.type == "employee") {
      query = `SELECT users.id, users.gender,
       CASE 
         WHEN users.gender = 'female' THEN 'انثى'
         WHEN users.gender = 'male' THEN 'ذكر'
       END AS gender_in_arabic,
       users.firstName, users.phone, users.nationalId, users.email, users.lastName,
       users.address, 
       CASE 
         WHEN sectors.name = 'Food' THEN 'الطعام'
         WHEN sectors.name = 'Entertainment' THEN 'ترفيه'
         WHEN sectors.name = 'Tech' THEN 'تكنولوجيا'
         WHEN sectors.name = 'Others' THEN 'آخرون'
         ELSE sectors.name
       END AS sector_in_arabic
     FROM users
     INNER JOIN employees ON users.id = employees.userId
     INNER JOIN sectors ON employees.sectorId = sectors.id
     INNER JOIN roles ON users.roleId = roles.id
     WHERE roles.name = '${req.params.type}';`
    } else {
      query = `SELECT users.id, users.gender,
       CASE 
       WHEN users.gender = 'female' THEN 'أنثى'
       WHEN users.gender = 'male' THEN 'ذكر'
     END AS gender_in_arabic, users.firstName, users.phone,users.nationalId, users.email, users.lastName,users.address
      FROM users
      INNER JOIN roles ON users.roleId = roles.id
      WHERE roles.name = '${req.params.type}';`
    }

    const { QueryTypes } = require('sequelize');
    const users = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log(complaint);
    res.send(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "catch errrrror" });
  }
}

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      nationalId,
      birthdate,
      gender,
    } = req.body;
    const user = await UserModel.findOne({ where: { email: req.body.email } });
    if (user) {
      res.json({ message: "email Already exist" });
    } else {
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALTROUND)
      );
      console.log(hashedPassword);

      // "admin", "citizen","employee"
      const role = await RoleModel.findOne({ where: { name: "citizen" } });
      const newUser = await UserModel.create({
        email: req.body.email,
        password: hashedPassword,
        roleId: role.id,
        firstName,
        lastName,
        phone,
        address,
        nationalId,
        birthdate,
        gender,
      });
      const citizen = await CitizenModel.create({
        userId: newUser.id,
      });
      const token = jwt.sign({ id: newUser.id }, process.env.jwtSecretEmail, {
        expiresIn: "1h",
      });
      const link = `${req.protocol}://${req.headers.host}/users/confirmEmail/${token}`;
      const message = `
        <a href='${link}'>Confirm Email</a>
        <br>
        `;
      sendEmail(newUser.email, "Account Activation", message);
      res.json({ message: "done", citizen });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error: error.toString() });
  }
};
const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ where: { email: req.body.email } });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        if (user.confirmedEmail == true) {
          const token = jwt.sign(
            { id: user.id, roleId: user.roleId },
            process.env.jwtSecret,
            {
              expiresIn: "24h",
            }
          );
          res.json({ token: token });
        } else {
          res.json({ message: "Email not Confirmed" });
        }
      } else {
        res.json({ message: "wrong credentials " });
      }
    } else {
      res.status(404).json({ message: "wrong credentials " });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error" });
  }
};
const employeeSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      nationalId,
      birthdate,
      gender,
      sectorId,
    } = req.body;
    const user = await UserModel.findOne({ where: { email: req.body.email } });
    if (user) {
      res.json({ message: "email Already exist" });
    } else {
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALTROUND)
      );
      const role = await RoleModel.findOne({ where: { name: "employee" } });

      const SECTORId = await sectors.findOne({ where: { name: sectorId } })
      var id = SECTORId.id
      const newUser = await UserModel.create({
        email: req.body.email,
        password: hashedPassword,
        roleId: role.id,
        firstName,
        lastName,
        phone,
        address,
        nationalId,
        birthdate,
        gender,
      });
      const employee = await EmployeeModel.create({
        userId: newUser.id,
        sectorId: id,
      });
      res.json({ message: "Done", employee });
    }
  } catch (error) {

    console.log(error)
    res.status(500).json({ message: "catch error", err: error.toString() });


  }
};

const ejs = require("ejs");

const confirmEmail = async (req, res) => {
  try {
    const checkToken = jwt.verify(req.params.token, process.env.jwtSecretEmail);
    if (checkToken) {
      const user = await UserModel.update(
        { confirmedEmail: true },
        { where: { id: checkToken.id } }
      );
      const html = await ejs.renderFile(
        "./src/modules/users/views/confirmation.ejs",
        { url: process.env.FRONTEND_URL }
      );
      res.send(html);
    }
  } catch (error) {
    const html = await ejs.renderFile("./src/modules/users/views/error.ejs", {
      message: "Failed to confirm email",
    });
    res.status(500).send(html);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await UserModel.findOne(
      { where: { id } },
      {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: RoleModel,
            attributes: ["name"],
          },
        ],
      }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "catch error" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.file) {
      const { secure_url: profilePic } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user/profile'
      })
      req.profilePic = profilePic
    }
    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALTROUND)
      );
      req.body.password = hashedPassword
    }
    const updated_user = await UserModel.update({
      ...req.body,
      // email: req.body.email,
      // password: req.body.password,
      // firstName: req.body.firstName,
      // lastName: req.body.lastName,
      // address: req.body.address,
      // phone: req.body.phone,
    },
      {
        where: {
          id: req.user.id
        }
      });

    res.status(200).json({ message: "The update done successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error" });
  }
}

module.exports = {
  signup,
  login,
  employeeSignup,
  getUserProfile,
  confirmEmail,
  updateUser,
  getUsers
};
