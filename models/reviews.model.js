const sequelize = require("../config/db");

const {DataTypes} = require("sequelize");
const Books = require("./books.model");
const Clients = require("./clients.model");

const Reviews = sequelize.define("reviews", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},
{
    freezeTableName: true,
}
)

Reviews.belongsTo(Books, { foreignKey: 'book_id' });
Books.hasMany(Reviews, { foreignKey: 'book_id' });

Reviews.belongsTo(Clients, { foreignKey: 'client_id' });
Clients.hasMany(Reviews, { foreignKey: 'client_id' });

module.exports = Reviews