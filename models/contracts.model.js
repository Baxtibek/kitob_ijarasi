const sequelize = require("../config/db");

const {DataTypes} = require("sequelize");
const Books = require("./books.model");
const Client = require("./clients.model");
const Status = require("./status.model");
const Owner = require("./owners.model");


const Contracts = sequelize.define("contracts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rent_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
},
{
    freezeTableName: true,
    timestamps: false
}
)

Contracts.belongsTo(Client, { foreignKey: 'client_id' });
Client.hasMany(Contracts, { foreignKey: 'client_id' });

Contracts.belongsTo(Books, { foreignKey: 'book_id' });
Books.hasMany(Contracts, { foreignKey: 'book_id' });

Contracts.belongsTo(Status, { foreignKey: 'status_id' });
Status.hasMany(Contracts,{ foreignKey: 'status_id' })

Contracts.belongsTo(Owner, { foreignKey: 'owner_id' });
Owner.hasMany(Contracts, { foreignKey: 'owner_id' });



module.exports = Contracts