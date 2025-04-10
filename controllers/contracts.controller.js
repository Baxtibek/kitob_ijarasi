const { errorHandler } = require("../helpers/error_handler");
const Books = require("../models/books.model");
const Clients = require("../models/clients.model");
const Contracts = require("../models/contracts.model");
const Owners = require("../models/owners.model");
const Status = require("../models/status.model");
const contractsValidationSchema = require("../validations/contracts.validation");


const addNewContract = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = contractsValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        

        const { rent_date, return_date, client_id, book_id, status_id, owner_id } = value; // clientId, bookId, statusId

        const newContract = await Contracts.create({rent_date, return_date, client_id, book_id, status_id, owner_id  });

        res.status(201).send({message: "New contract added", newContract})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllContracts = async (req, res) => {
    try {
        const contracts = await Contracts.findAll({include: [Clients, Books, Status, Owners]});
        if(!contracts){
            return res
                .status(400)
                .send({message: "Birorta contract topilmadi"})
        }
        res.status(201).send({contracts})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findContractById = async (req, res) =>{
    try {
        const {id} = req.params
        const contract = await Contracts.findByPk(id, {include: [Clients, Books, Status, Owners]})
        if(!contract){
            return res
                .status(400)
                .send({message: "Contract topilmadi!"})
        }
        res.status(201).send({contract})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateContractById = async (req, res) => {
    try {
        const {error, value} = contractsValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        const {id} = req.params

        const {rent_date, return_date, client_id, book_id, status_id, owner_id } = value;

        const newContract = await Contracts.update({rent_date, return_date, client_id, book_id, status_id, owner_id }, 
        {where: {id}, returning: true}
    );

    res.status(200).send({newContract: newContract[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteContractById = async (req, res) => {
    try {
        const {id} = req.params;
        const contract = await Contracts.destroy({where: {id}})
        res.status(201).send({message: "Contract ochiyildi"}, contract)
    } catch (error) {
       errorHandler(error, res) 
    }
}

module.exports = {
    addNewContract,
    findAllContracts,
    findContractById,
    updateContractById,
    deleteContractById,
}