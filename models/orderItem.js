'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    order_id: DataTypes.INTEGER,
    sku: DataTypes.STRING,
    product_name: DataTypes.STRING,
    purchased_quantity: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    item_price: DataTypes.FLOAT
  }, {});

  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
  };

  return OrderItem;
};
