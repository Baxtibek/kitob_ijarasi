const sequelize = require("../config/db");

const {DataTypes} = require("sequelize");


const Clients = sequelize.define("clients", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    full_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    registered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    refresh_token: {
        type: DataTypes.STRING
    },
    activation_link: {
        type: DataTypes.STRING
    }
},
{
    freezeTableName: true,
}
)


module.exports = Clients