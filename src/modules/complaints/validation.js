const joi = require("joi");

const addComplaint = {
    body: joi.object().required().keys({
        body: joi.string().required(),
    }).messages({
        'any.required': 'Request body is required',
        'string.empty': 'Complaint body cannot be empty'
    })
}
const changeState = {
    body: joi.object().required().keys({
        state: joi
            .string()
            .valid('viewed','need-action', 'completed')
            .required(),
    }).options({ allowUnknown: false }),
    params: joi.object().required().keys({
        id: joi.number().required(),
    })
}

module.exports = { addComplaint, changeState };