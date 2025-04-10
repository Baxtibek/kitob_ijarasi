const { Op } = require("sequelize");
const Contracts = require("../models/contracts.model");
const Clients = require("../models/clients.model");
const Books = require("../models/books.model");
const Status = require("../models/status.model");

const getDamagedClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Sanalarni to'g'ri formatda yuboring: YYYY-MM-DD" });
    }

    const damagedClients = await Contracts.findAll({
      where: {
        return_date: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Clients,
          attributes: ["id", "full_name"],
        },
        {
          model: Books,
          attributes: ["title"],
        },
        {
          model: Status,
          where: { name: "invalid" },
          attributes: ["name"],
        },
      ],
      attributes: ["return_date"],
      distinct: true,
    });

    res.status(200).json({ damagedClients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    getDamagedClients
}