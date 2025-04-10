const sequelize = require("../config/db");

const {DataTypes, STRING} = require("sequelize")

const Admins = sequelize.define("admins", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
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
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    refresh_token: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM("admin", "superadmin"),
        allowNull: false,
        defaultValue: "admin",
    }
},
{
    freezeTableName: true,
    timestamps: false
}
)

module.exports = Admins