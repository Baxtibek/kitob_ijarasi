const Joi = require("joi");

const contractsValidationSchema = Joi.object({
    rent_date: Joi.date()
        .required()
        .messages({
            "date.base": "Ijara sanasi noto'g'ri formatda.",
            "any.required": "Ijara sanasi majburiy."
        }),
    return_date: Joi.date()
        .greater(Joi.ref("rent_date"))
        .required()
        .messages({
            "date.base": "Qaytarish sanasi noto'g'ri formatda.",
            "date.greater": "Qaytarish sanasi ijaraga olingan sanadan keyin bo'lishi kerak.",
            "any.required": "Qaytarish sanasi majburiy."
        }),
    client_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Client ID raqam bo'lishi kerak.",
            "any.required": "Client ID majburiy."
        }),
    book_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Book ID raqam bo'lishi kerak.",
            "any.required": "Book ID majburiy."
        }),
    status_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Status ID raqam bo'lishi kerak.",
            "any.required": "Status ID majburiy."
        }),
    owner_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Owner ID raqam bo'lishi kerak.",
            "any.required": "Owner ID majburiy."
        }),
});

module.exports = contractsValidationSchema;
