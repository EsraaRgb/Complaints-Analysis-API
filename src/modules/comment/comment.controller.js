const ComplaintModel = require("../../../DB/models/complaint.model");
const UserModel = require("../../../DB/models/user.model");
const CommentModel = require("../../../DB/models/comment.model");
const EmployeeModel = require("../../../DB/models/employee.model");
const CitizenModel = require("../../../DB/models/citizen.model");
const cloudinary = require("../../services/cloudinary");

const getComment = async (req, res) => {
    try {
        const Comments = await CommentModel.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.send(Comments)
    } catch (error) {
        res.status(500).json({ message: "catch an error" })
    }
}


// add new comment to complaint 
const addComment = async (req, res) => {
    // try {
    const { id } = req.params;
    const { body } = req.body;
    let senderID, reciverID;
    const complaint = await ComplaintModel.findOne({ where: { id: id } });
    const employee = await EmployeeModel.findOne({ where: { id: complaint.employeeId } });
    if (complaint && complaint.status != "closed") {
        const oldComments = await CommentModel.findAll({ where: { complaintId: id } })
        if (req.user.roleId == 2) { //citizen 
            if (oldComments.length == 0 || complaint.employeeId == null) {
                return res.status(400).json({ message: "Employee Should Start Conversation" })
            }
            else {
                senderID = req.user.id;
                reciverID = employee.userId
            }
        }

        else if (req.user.roleId == 3) { // Employee
            if (!employee) {
                return res.status(400).json({ message: "You are not allowed to add comment for this complaint" })
            }
            if (employee.userId == req.user.id) {
                senderID = req.user.id;
                const citizen = await CitizenModel.findOne({ where: { id: complaint.citizenId } });
                const reciver = await UserModel.findOne({ where: { id: citizen.userId } });
                reciverID = reciver.id
            }
            else {
                return res.status(400).json({ message: "You are not allowed to add comment for this complaint" })
            }
        }
        let attachments = null;
        if (req.file) {
            const {secure_url} = await cloudinary.uploader.upload(req.file.path, {folder: "attachmentss"});
            attachments = secure_url;
        }
        const comment = await CommentModel.create({
            body,
            complaintId: id,
            senderID,
            reciverID,
            attachments
        });
        res.json({ comment });
    }
    else {
        res.status(404).json({ message: "Cannot add Comment " })
    }
    // } catch (error) {
    //     res.status(500).json({ message: "catch error" });
    // }
}
module.exports = {
    addComment,
    getComment,
};