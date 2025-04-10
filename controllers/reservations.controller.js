const { errorHandler } = require("../helpers/error_handler");
const Books = require("../models/books.model");
const Clients = require("../models/clients.model");
const Reservations = require("../models/reservations.model");
const reservationValidationSchema = require("../validations/reservations.validation");


const addNewReservation = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = reservationValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        

        const { reserved_from, reserved_to, status, book_id, client_id } = value; // bookId, cientId

        const newReservation = await Reservations.create({reserved_from, reserved_to, status , book_id, client_id });

        res.status(201).send({message: "New reservation added", newReservation})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllReservations = async (req, res) => {
    try {
        const reservations = await Reservations.findAll({message: [Books, Clients]});
        if(!reservations){
            return res
                .status(400)
                .send({message: "Birorta reservation topilmadi"})
        }
        res.status(201).send({reservations})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findReservationById = async (req, res) =>{
    try {
        const {id} = req.params
        const reservation = await Reservations.findByPk(id, {message: [Books, Clients]})
        if(!reservation){
            return res
                .status(400)
                .send({message: "Reservation topilmadi!"})
        }
        res.status(201).send({reservation})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateReservationById = async (req, res) => {
    try {
        const {error, value} = reservationValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        const {id} = req.params

        const {reserved_from, reserved_to, status , book_id, client_id } = value;

        const newReservation = await Reservations.update({reserved_from, reserved_to, status , book_id, client_id }, 
        {where: {id}, returning: true}
    );

    res.status(200).send({newReservation: newReservation[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteReservationById = async (req, res) => {
    try {
        const {id} = req.params;
        const reservation = await Reservations.destroy({where: {id}})
        res.status(201).send({message: "Reservation ochiyildi"}, reservation)
    } catch (error) {
       errorHandler(error, res) 
    }
}

module.exports = {
    addNewReservation,
    findAllReservations,
    findReservationById,
    updateReservationById,
    deleteReservationById,
}