const Joi = require("joi");

const statusValidationSchema = Joi.object({
    name: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.empty": "Foydalanuvchi nomi bo'sh bo'lmasligi kerak.",
            "string.max": "Foydalanuvchi nomi 30 ta belgidan oshmasligi kerak."
        })
});

module.exports = statusValidationSchema;
