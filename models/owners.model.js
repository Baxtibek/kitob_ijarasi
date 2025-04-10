const sequelize = require("../config/db");

const {DataTypes} = require("sequelize");

const Owners = sequelize.define("owners", {
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
    address: {
        type: DataTypes.TEXT,
        allowNull: false
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
    timestamps: false
}
)





module.exports = Owners