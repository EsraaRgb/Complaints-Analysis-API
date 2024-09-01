const nodemailer = require("nodemailer")
const sendEmail = async (dest, subject, message, attachments = []) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "localhost",
        port: 587,
        auth: {
            user: process.env.nodeMailerEmail, // generated ethereal user
            pass: process.env.nodeMailerPassword, // generated ethereal password
        },
    })
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Complains Portal" < ${process.env.nodeMailerEmail}>`, // sender address
        to: dest, // list of receivers
        subject, // Subject line
        html: message, // html body
        attachments,
    })
    return info
}

module.exports = sendEmail
