const joi = require("joi");

const addComment = {
    params: joi.object().required().keys({
        id: joi.number().required().messages({ 'any.required': 'Complaint id is required' }),
    }),
    body: joi.object().keys({
        body: joi.string().max(225)
    })
}

module.exports = { addComment };
