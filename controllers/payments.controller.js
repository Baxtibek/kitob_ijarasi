const { errorHandler } = require("../helpers/error_handler");
const Contracts = require("../models/contracts.model");
const Payments = require("../models/payments.model");
const paymentValidationSchema = require("../validations/payments.validation");


const addNewPayment = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = paymentValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        

        const { amount, payment_type, payment_date, contract_id } = value; //contactId

        const newPayment = await Payments.create({amount, payment_type, payment_date, contract_id });

        res.status(201).send({message: "New payment added", newPayment})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllPayments = async (req, res) => {
    try {
        const payments = await Payments.findAll({include: Contracts });
        if(!payments){
            return res
                .status(400)
                .send({message: "Birorta payment topilmadi"})
        }
        res.status(201).send({payments})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findPaymentById = async (req, res) =>{
    try {
        const {id} = req.params
        const payment = await Payments.findByPk(id, {include: Contracts })
        if(!payment){
            return res
                .status(400)
                .send({message: "Payment topilmadi!"})
        }
        res.status(201).send({payment})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updatePaymentById = async (req, res) => {
    try {
        const {error, value} = paymentValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        const {id} = req.params

        const {amount, payment_type, payment_date, contract_id } = value;

        const newPayment = await Payments.update({amount, payment_type, payment_date, contract_id }, 
        {where: {id}, returning: true}
    );

    res.status(200).send({newPayment: newPayment[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const deletePaymentById = async (req, res) => {
    try {
        const {id} = req.params;
        const payment = await Payments.destroy({where: {id}})
        res.status(201).send({message: "Payment ochiyildi"}, payment)
    } catch (error) {
       errorHandler(error, res) 
    }
}

module.exports = {
    addNewPayment,
    findAllPayments,
    findPaymentById,
    updatePaymentById,
    deletePaymentById,
}