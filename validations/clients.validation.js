const Joi = require("joi");

const clientValidationSchema = Joi.object({
    full_name: Joi.string()
        .max(50)
        .required()
        .messages({
            "string.empty": "To'liq ism bo'sh bo'lmasligi kerak.",
            "string.max": "To'liq ism 50 ta belgidan oshmasligi kerak."
        }),
    phone_number: Joi.string()
        .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.empty": "Telefon raqam bo'sh bo'lmasligi kerak.",
            "string.pattern.base": "Telefon raqam formati noto'g'ri (masalan: 90-123-45-67)."
        }),
    email: Joi.string()
        .email()
        .max(50)
        .required()
        .messages({
            "string.empty": "Email bo'sh bo'lmasligi kerak.",
            "string.email": "Email noto'g'ri formatda.",
            "string.max": "Email 50 ta belgidan oshmasligi kerak."
        }),
    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .messages({
            "string.empty": "Parol bo'sh bo'lmasligi kerak.",
            "string.min": "Parol kamida 6 ta belgidan iborat bo'lishi kerak.",
            "string.max": "Parol 30 ta belgidan oshmasligi kerak."
        }),
    registered_at: Joi.date()
        .messages({
            "date.base": "Ro'yxatdan o'tgan sana noto'g'ri formatda.",
            "any.required": "Ro'yxatdan o'tgan sana bo'lishi kerak."
        }),
    confirm_password: Joi.ref("password"),
    activation_link: Joi.string()
      
});

module.exports = clientValidationSchema;
