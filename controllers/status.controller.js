const { errorHandler } = require("../helpers/error_handler");
const Status = require("../models/status.model");
const statusValidationSchema = require("../validations/status.validation");


const addNewStatus = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = statusValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        

        const { name } = value;

        const newStatus = await Status.create({ name });

        res.status(201).send({message: "New status added", newStatus})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllStatus = async (req, res) => {
    try {
        const status = await Status.findAll();
        if(!status){
            return res
                .status(400)
                .send({message: "Birorta status topilmadi"})
        }
        res.status(201).send({status})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findStatusById = async (req, res) =>{
    try {
        const {id} = req.params
        const status = await Status.findByPk(id)
        if(!status){
            return res
                .status(400)
                .send({message: "Status topilmadi!"})
        }
        res.status(201).send({status})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateStatusById = async (req, res) => {
    try {
        const {error, value} = statusValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        const {id} = req.params

        const {name } = value;

        const newStatus = await Status.update({name }, 
        {where: {id}, returning: true}
    );

    res.status(200).send({newStatus: newStatus[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteStatusById = async (req, res) => {
    try {
        const {id} = req.params;
        const status = await Status.destroy({where: {id}})
        res.status(201).send({message: "Status ochiyildi"}, status)
    } catch (error) {
       errorHandler(error, res) 
    }
}

module.exports = {
    addNewStatus,
    findAllStatus,
    findStatusById,
    updateStatusById,
    deleteStatusById,
}