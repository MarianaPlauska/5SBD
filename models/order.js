'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    purchase_date: DataTypes.DATE,
    payments_date: DataTypes.DATE,
    buyer_email: DataTypes.STRING,
    buyer_name: DataTypes.STRING,
    cpf: DataTypes.STRING,
    buyer_phone_number: DataTypes.STRING,
    ship_address_1: DataTypes.STRING,
    ship_address_2: DataTypes.STRING,
    ship_address_3: DataTypes.STRING,
    ship_city: DataTypes.STRING,
    ship_state: DataTypes.STRING,
    ship_postal_code: DataTypes.STRING,
    ship_country: DataTypes.STRING
  }, {});

  Order.associate = function(models) {
    Order.belongsTo(models.Customer, { foreignKey: 'cpf', targetKey: 'cpf' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
  };

  return Order;
};
