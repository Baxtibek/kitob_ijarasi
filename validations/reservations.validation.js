const Joi = require("joi");

const reservationValidationSchema = Joi.object({
    reserved_from: Joi.date()
        .required()
        .messages({
            "any.required": "Boshlanish sanasi kerak.",
            "date.base": "Boshlanish sanasi noto'g'ri formatda."
        }),
        
    reserved_to: Joi.date()
        .required()
        .messages({
            "any.required": "Tugash sanasi kerak.",
            "date.base": "Tugash sanasi noto'g'ri formatda."
        }),

    status: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.empty": "Status bo'sh bo'lmasligi kerak.",
            "string.max": "Status 30 belgidan oshmasligi kerak."
        }),

    book_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Kitob ID raqam bo'lishi kerak.",
            "any.required": "Kitob ID kerak."
        }),

    client_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Client ID raqam bo'lishi kerak.",
            "any.required": "Client ID kerak."
        })
});

module.exports = reservationValidationSchema;
