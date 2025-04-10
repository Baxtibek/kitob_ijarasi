const Joi = require("joi");


const bookValidationSchema = Joi.object({
    title: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.empty": "Kitob nomi bo'sh bo'lmasligi kerak.",
            "string.max": "Kitob nomi 30 ta belgidan oshmasligini kerak."
        }),
    author: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.empty": "Author nomi bo'sh bo'lmasligi kerak.",
            "string.max": "Kitob nomi 30 ta belgidan oshmasligi kerak."
        }),
    year: Joi.number()
        .integer()
        .min(500)
        .max(new Date().getFullYear()) // hozirgi yil
        .required()
        .messages({
            "number.base": "Yil raqami bo'lishi kerak.",
            "number.min": "Yil 500 dan kichik bo'lmasligi kerak.",
            "number.max": "Yil hozirgi yildan oshmasligi kerak."
        }),
    isbn: Joi.string()
        .length(13)
        .required()
        .messages({
            "string.empty": "ISBN raqami bo'lishi kerak.",
            "string.length": "ISBN raqami 13 ta belgidan iborat bo'lishi kerak."
        }),
    language: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.empty": "Til nomi bo'lishi kerak.",
            "string.max": "Til nomi 30 ta belgidan oshmasligi bo'lishi kerak."
        }),
    pages: Joi.number()
        .integer()
        .min(30)
        .required()
        .messages({
            "number.base": "Sahifa soni raqam bo'lishi kerak.",
            "number.min": "Kitob kamida 30 ta sahifadan iborat bo'lishi kerak."
        }),
    publisher: Joi.string()
        .max(30)
        .required()
        .messages({
            "string.empty": "Nashriyot nomi bo'lishi kerak.",
            "string.max": "Nashriyot nomi 30 ta belgidan oshmasligi kerak."
        }),
    description: Joi.string()
        .required()
        .messages({
            "string.empty": "Kitob tarifi bo'lishi kerak."
        }),
    price_per_day: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Narx raqami bo'lishi kerak.",
            "number.min": "Narx manfiy bo'lmasligi kerak."
        }),
    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "Omborda kitoblar soni raqam bo'lishi kerak.",
            "number.min": "Omborda kitoblar soni manfiy bo'lmasligi kerak."
        }),
    category_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "categoryId raqam bo'lishi kerak.",
            "number.empty": "categoryId bo'lishi kerak."
        }),
    owner_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "ownerId raqam bo'lishi kerak.",
            "number.empty": "ownerId bo'lishi kerak."
        }),
})

module.exports = bookValidationSchema