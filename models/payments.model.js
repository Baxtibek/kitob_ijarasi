const sequelize = require("../config/db");

const {DataTypes} = require("sequelize");
const Contracts = require("./contracts.model");


const Payments = sequelize.define("payments", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    payment_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},
{
    freezeTableName: true,
}
)

Payments.belongsTo(Contracts, { foreignKey: 'contract_id' });
Contracts.hasMany(Payments, { foreignKey: 'contract_id' });

module.exports = Payments

