const { fn, col } = require("sequelize");
const Contracts = require("../models/contracts.model");
const Books = require("../models/books.model");
const Categories = require("../models/categories.model");

const getTopAuthorsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const topAuthors = await Contracts.findAll({
      include: [
        {
          model: Books,
          attributes: [],
          include: [
            {
              model: Categories,
              where: { name: categoryName },
              attributes: [],
            },
          ],
        },
      ],
      attributes: [
        [col("book.author"), "author"], // book jadvalidagi author ustuni
        [fn("COUNT", "*"), "rental_count"],
      ],
      group: ["book.author"],
      order: [[fn("COUNT", "*"), "DESC"]],
      raw: true,
    });

    res.status(200).json({ topAuthors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    getTopAuthorsByCategory
}
