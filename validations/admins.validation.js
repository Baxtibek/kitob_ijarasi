const Joi = require("joi");

const adminValidationSchema = Joi.object({
    username: Joi.string()
        .max(50)
        .required()
        .messages({
            "string.empty": "Foydalanuvchi nomi bo'sh bo'lmasligi kerak.",
            "string.max": "Foydalanuvchi nomi 50 ta belgidan oshmasligi kerak."
        }),
    phone_number: Joi.string().pattern(/^(\d{2})-(\d{3})-(\d{2})-(\d{2})$/)
        .max(15)
        .required()
        .messages({
            "string.empty": "Telefon raqam bo'sh bo'lmasligi kerak.",
            "string.max": "Telefon raqam 15 ta belgidan oshmasligi kerak."
        }),
    email: Joi.string()
        .email()
        .max(50)
        .required()
        .messages({
            "string.empty": "Email bo'sh bo'lmasligi kerak.",
            "string.max": "Email 50 ta belgidan oshmasligi kerak.",
            "string.email": "Email noto'g'ri formatda."
        }),
    password: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.empty": "Parol bo'sh bo'lmasligi kerak.",
            "string.max": "Parol 30 ta belgidan oshmasligi kerak."
        }),
    is_active: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "is_active boolean bo'lishi kerak."
        }),
    role: Joi.string().valid("admin", "superadmin").required().messages({
        "any.only": "Roli faqat 'admin' yoki 'superadmin' bo'lishi mumkin",
        "any.required": "Roli tanlanishi kerak",
    }),
      
    confirm_password: Joi.ref("password")
});

module.exports = adminValidationSchema;
