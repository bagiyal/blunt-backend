"use strict";
const { Model, Sequelize } = require("sequelize");
const sequelize = require("../../config/database");
module.exports = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
    },
    savedNewsId: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    categories: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    token: {
      type: Sequelize.STRING,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    modelName: "user",
  }
);
