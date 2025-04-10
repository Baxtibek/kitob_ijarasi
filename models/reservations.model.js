const sequelize = require("../config/db");

const {DataTypes} = require("sequelize");
const Books = require("./books.model");
const Clients = require("./clients.model");

const Reservations = sequelize.define("reservations", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reserved_from: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reserved_to: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: false,
    }
},
{
    freezeTableName: true,
    timestamps: false
}
)

Reservations.belongsTo(Books, { foreignKey: 'book_id' });
Books.hasMany(Reservations, { foreignKey: 'book_id' });

Reservations.belongsTo(Clients, { foreignKey: 'client_id' });
Clients.hasMany(Reservations, { foreignKey: 'client_id' });


module.exports = Reservations