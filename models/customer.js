'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    cpf: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});

  Customer.associate = function(models) {
    Customer.hasMany(models.Order, { foreignKey: 'cpf', sourceKey: 'cpf' });
  };

  return Customer;
};
