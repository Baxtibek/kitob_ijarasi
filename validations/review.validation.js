const Joi = require("joi");

const reviewValidationSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            "number.base": "Reyting raqam bo'lishi kerak.",
            "number.integer": "Reyting butun son bo'lishi kerak.",
            "number.min": "Reyting eng kamida 1 bo'lishi kerak.",
            "number.max": "Reyting 5 dan oshmasligi kerak.",
            "any.required": "Reyting majburiy maydon."
        }),

    comment: Joi.string()
        .min(5)
        .required()
        .messages({
            "string.base": "Izoh matn bo'lishi kerak.",
            "string.empty": "Izoh bo'sh bo'lmasligi kerak.",
            "string.min": "Izoh kamida 5 ta belgidan iborat bo'lishi kerak.",
            "any.required": "Izoh majburiy maydon."
        }),

    book_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "bookId raqam bo'lishi kerak.",
            "any.required": "bookId majburiy maydon."
        }),

    client_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "clientId raqam bo'lishi kerak.",
            "any.required": "clientId majburiy maydon."
        })
});

module.exports = reviewValidationSchema;
