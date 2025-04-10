const { Op } = require("sequelize");
const Clients = require("../models/clients.model");
const Books = require("../models/books.model");
const Status = require("../models/status.model");
const Contracts = require("../models/contracts.model");

const getCancelledClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    // Sanani tekshiramiz
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Sanani to'g'ri yuboring: YYYY-MM-DD" });
    }

    const cancelledClients = await Contracts.findAll({
      where: {
        rent_date: {
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
          where: { name: "refunded" },
          attributes: ["name"],
        },
      ],
      attributes: ["rent_date"],
      distinct: true,
    });

    res.status(200).json({ cancelledClients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    getCancelledClients
}
