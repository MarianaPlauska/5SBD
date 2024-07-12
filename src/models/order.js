const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  }
}, {
  tableName: 'orders',
  timestamps: false //para n add as tabelas automáticas - createAt e updateAt
});

module.exports = Order;
