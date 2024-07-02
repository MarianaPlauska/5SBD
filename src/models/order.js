const { Model, DataTypes } = require('sequelize');
const Product = require('./product');

class Order extends Model {
  static init(sequelize) {
    super.init({
      status: DataTypes.STRING,
      deliveryAddress: DataTypes.STRING,
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: Product,
          key: 'id'
        }
      }
    }, { sequelize, modelName: 'Order' });
  }
}

module.exports = Order;
