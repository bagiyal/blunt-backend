"use strict";
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database");
module.exports = sequelize.define(
  "saveds",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    categories: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    // freezeTableName: true,
    // paranoid: true,
    modelName: "saveds",
  }
);
