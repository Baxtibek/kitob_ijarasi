const sequelize = require("../config/db");

const {DataTypes} = require("sequelize")

const Categories = sequelize.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamps: false
}
)

module.exports = Categories