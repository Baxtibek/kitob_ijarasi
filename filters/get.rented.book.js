const { Op } = require("sequelize");
const Books = require("../models/books.model");
const Contracts = require("../models/contracts.model");

const getRentedBooks = async (req, res) => {
  try {
    // Birinchi filter
    const { start_date, end_date } = req.body;

    const rentedBooks = await Contracts.findAll({
      where: {
        rent_date: {
          [Op.gte]: new Date(start_date)
        },
        return_date: {
          [Op.lte]: new Date(end_date)
        }
      },
      include: [
        {
          model: Books,
          attributes: ["id", "title", "author"]
        }
      ],
      attributes: ["rent_date", "return_date"]
    });

    res.status(200).json({ rentedBooks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    getRentedBooks
}