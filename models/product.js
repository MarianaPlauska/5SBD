'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    available_quantity: DataTypes.INTEGER
  }, {});

  return Product;
};
