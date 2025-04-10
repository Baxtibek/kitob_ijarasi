const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/categories.model");
const categoriesValidationSchema = require("../validations/categories.validation");


const addNewCategory = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = categoriesValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        

        const { name } = value;

        const newCategory = await Category.create({ name });

        res.status(201).send({message: "New category added", newCategory})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        if(!categories){
            return res
                .status(400)
                .send({message: "Birorta category topilmadi"})
        }
        res.status(201).send({categories})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findCategoryById = async (req, res) =>{
    try {
        const {id} = req.params
        const category = await Category.findByPk(id)
        if(!category){
            return res
                .status(400)
                .send({message: "Category topilmadi!"})
        }
        res.status(201).send({category})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateCategoryById = async (req, res) => {
    try {
        const {error, value} = categoriesValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        const {id} = req.params

        const {name } = value;

        const newCategory = await Category.update({ name }, 
        {where: {id}, returning: true}
    );

    res.status(200).send({newCategory: newCategory[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteCategoryById = async (req, res) => {
    try {
        const {id} = req.params;
        const category = await Category.destroy({where: {id}})
        res.status(201).send({message: "Category ochiyildi"}, category)
    } catch (error) {
       errorHandler(error, res) 
    }
}

module.exports = {
    addNewCategory,
    findAllCategories,
    findCategoryById,
    updateCategoryById,
    deleteCategoryById,
}