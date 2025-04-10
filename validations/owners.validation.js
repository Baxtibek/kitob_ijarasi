const Joi = require("joi");

const ownerValidationSchema = Joi.object({
    full_name: Joi.string()
        .max(50)
        .required()
        .messages({
            "string.empty": "Fullname ism bo'sh bo'lmasligi kerak.",
            "string.max": "Fullname ism 50 ta belgidan oshmasligi kerak."
        }),
    phone_number: Joi.string()
        .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/) // telefon raqamiga maxsus format qo'shildi
        .required()
        .messages({
            "string.empty": "Telefon raqam bo'sh bo'lmasligi kerak.",
            "string.pattern.base": "Telefon raqam noto'g'ri formatda bo'lishi kerak. Format: XX-XXX-XX-XX"
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
    address: Joi.string()
        .required()
        .messages({
            "string.empty": "Manzil bo'sh bo'lmasligi kerak."
        }),
    confirm_password: Joi.ref("password"),
    activation_link: Joi.string()
    
});

module.exports = ownerValidationSchema;
