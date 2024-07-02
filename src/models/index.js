const sequelize = require('../config/database');
const Product = require('./product');
const Order = require('./order');

Product.init(sequelize);
Order.init(sequelize);

Order.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Order, { foreignKey: 'productId' });

sequelize.sync();

module.exports = { sequelize, Product, Order };
