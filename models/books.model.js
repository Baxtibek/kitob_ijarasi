const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");
const Categories = require("./categories.model");
const Owner = require("./owners.model");

const Books = sequelize.define("books", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isbn: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    language: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    publisher: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price_per_day: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categories,
            key: 'id'
        }
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Owner,
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Books.belongsTo(Categories, { foreignKey: 'category_id' });
Categories.hasMany(Books, { foreignKey: 'category_id' });

Books.belongsTo(Owner, { foreignKey: 'owner_id' });
Owner.hasMany(Books, { foreignKey: "owner_id" });

module.exports = Books;
