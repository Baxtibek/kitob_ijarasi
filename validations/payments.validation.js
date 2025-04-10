const Joi = require("joi");

const paymentValidationSchema = Joi.object({
    amount: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "To'lov miqdori raqam bo'lishi kerak.",
            "number.positive": "To'lov miqdori musbat bo'lishi kerak.",
            "any.required": "To'lov miqdori kiritilishi shart."
        }),
    payment_type: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.base": "To'lov turi matn bo'lishi kerak.",
            "string.max": "To'lov turi 30 ta belgidan oshmasligi kerak.",
            "any.required": "To'lov turi kiritilishi shart."
        }),
    payment_date: Joi.date()
        .optional()
        .messages({
            "date.base": "To'lov sanasi noto'g'ri formatda kiritildi."
        }),
    contract_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "contractId butun son bo'lishi kerak.",
            "any.required": "contractId kiritilishi shart."
        })
});

module.exports = paymentValidationSchema;
