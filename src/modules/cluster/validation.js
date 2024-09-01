const joi = require("joi");
const saveClusters = {
    body: joi.object().required().keys({
        clusters: joi.array().items(
            joi.object({
                cluster_id: joi.number().integer().required(),
                complaints: joi.array().items(
                    joi.object({
                        id: joi.number().integer().required(),
                        complaint: joi.string().required()
                    })
                ),
                keywords: joi.array().items(joi.string().required()),
                cluster_name: joi.string().required(),
                number_of_complaints: joi.number().integer().required()
            }).required()
        ).required()
    }).messages({
        'any.required': 'Request body is required',
        'string.empty': 'Complaint body cannot be empty'
    })
}
module.exports = saveClusters