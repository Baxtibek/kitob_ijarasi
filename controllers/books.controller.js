const { errorHandler } = require("../helpers/error_handler");
const Books = require("../models/books.model");
const Categories = require("../models/categories.model");
const Owners = require("../models/owners.model");
const bookValidationSchema = require("../validations/books.validation");


const addNewBook = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = bookValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        

        const {
            title, 
            author, 
            year, 
            isbn, 
            language,  
            pages, 
            publisher, 
            description,  
            price_per_day, 
            stock,
            category_id, 
            owner_id
        } = value; // categoryId, ownerId,


        const newBook = await Books.create({
            title, 
            author, 
            year, 
            isbn, 
            language,  
            pages, 
            publisher, 
            description,  
            price_per_day, 
            stock,
            category_id, 
            owner_id 
        });

        res.status(201).send({message: "New book added", newBook})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllBooks = async (req, res) => {
    try {
        const books = await Books.findAll({include: [Categories, Owners]});
        if(!books){
            return res
                .status(400)
                .send({message: "Birorta book topilmadi"})
        }
        res.status(201).send({books})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findBookById = async (req, res) =>{
    try {
        const {id} = req.params
        const book = await Books.findByPk(id, {include: [Categories, Owners]})
        if(!book){
            return res
                .status(400)
                .send({message: "Book topilmadi!"})
        }
        res.status(201).send({book})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateBookById = async (req, res) => {
    try {
        const {error, value} = bookValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: "Validatsiya qilishda xatolik"})
        }
        const {id} = req.params

        const {
            title, 
            author, 
            year, isbn, 
            language,  
            pages, 
            publisher, 
            description,  
            price_per_day, 
            stock,
            category_id, 
            owner_id 
        } = value;

        const newBook = await Books.update({
            title, 
            author, 
            year, 
            isbn, 
            language,  
            pages, 
            publisher, 
            description,  
            price_per_day, 
            stock,
            category_id, 
            owner_id 
        }, 
        {where: {id}, returning: true}
    );

    res.status(200).send({newBook: newBook[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteBookById = async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Books.destroy({where: {id}})
        res.status(201).send({message: "Books ochiyildi"}, book)
    } catch (error) {
       errorHandler(error, res) 
    }
}

module.exports = {
    addNewBook,
    findAllBooks,
    findBookById,
    updateBookById,
    deleteBookById,
}