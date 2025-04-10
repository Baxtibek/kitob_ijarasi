const { errorHandler } = require("../helpers/error_handler");
const Books = require("../models/books.model");
const Categories = require("../models/categories.model");
const Clients = require("../models/clients.model");
const Contracts = require("../models/contracts.model");
const Owners = require("../models/owners.model");
const Payments = require("../models/payments.model");

const getClientPayments = async (req, res) => {
    try {
      // Beshichi filter
      const { client_id } = req.body;
  
      const payments = await Payments.findAll({
        include: [
          {
            model: Contracts,
            where: { client_id },
            include: [
              {
                model: Clients,
                attributes: ["full_name", "email"],
              },
              {
                model: Books,
                attributes: ["title"],
                include: [
                  {
                    model: Owners,
                    attributes: ["full_name"],
                  },
                  {
                    model: Categories,
                    attributes: ["name"],
                  },
                ],
              },
            ],
            attributes: [],
          },
        ],
        attributes: ["amount", "payment_type", "payment_date"],
        raw: true,
      });
  
      const formatted = payments.map((p) => ({
        client_name: p["contract.client.full_name"],
        client_email: p["contract.client.email"],
        category_name: p["contract.book.category.name"],
        book_title: p["contract.book.title"],
        owner_name: p["contract.book.owner.full_name"],
        amount: p.amount,
        payment_type: p.payment_type,
        payment_date: p.payment_date,
      }));
  
      res.status(200).send({ payments: formatted });
    } catch (error) {
      errorHandler(error, res);
    }
  };

  module.exports = {
    getClientPayments
  }