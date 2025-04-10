const { errorHandler } = require("../helpers/error_handler");
const Books = require("../models/books.model");
const Clients = require("../models/clients.model");
const Reviews = require("../models/reviews.model");
const reviewValidationSchema = require("../validations/review.validation");


const addNewReview = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = reviewValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        

        const { rating, comment, created_at, book_id, client_id } = value; // bookId, cientId

        const newReview = await Reviews.create({rating, comment, created_at , book_id, client_id });

        res.status(201).send({message: "New review added", newReview})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllReviews = async (req, res) => {
    try {
        const reviews = await Reviews.findAll({message: [Books, Clients]});
        if(!reviews){
            return res
                .status(400)
                .send({message: "Birorta review topilmadi"})
        }
        res.status(201).send({reviews})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findReviewById = async (req, res) =>{
    try {
        const {id} = req.params
        const review = await Reviews.findByPk(id)
        if(!review){
            return res
                .status(400)
                .send({message: "Review topilmadi!"})
        }
        res.status(201).send({review})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateReviewById = async (req, res) => {
    try {
        const {error, value} = reviewValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        const {id} = req.params

        const {rating, comment, created_at , book_id, client_id } = value;

        const newReview = await Reviews.update({rating, comment, created_at , book_id, client_id }, 
        {where: {id}, returning: true}
    );

    res.status(200).send({newReview: newReview[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteReviewById = async (req, res) => {
    try {
        const {id} = req.params;
        const review = await Reviews.destroy({where: {id}})
        res.status(201).send({message: "Review ochiyildi"}, review)
    } catch (error) {
       errorHandler(error, res) 
    }
}

module.exports = {
    addNewReview,
    findAllReviews,
    findReviewById,
    updateReviewById,
    deleteReviewById,
}