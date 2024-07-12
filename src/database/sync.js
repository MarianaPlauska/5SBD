const sequelize = require('../config/database');
const Cliente = require('../models/customer');
const Produto = require('../models/product');
const Pedido = require('../models/order');
const ItensPedido = require('../models/orderItem');

(async () => {
  try 
  {
    await sequelize.sync({ force: true });
    console.log('Database & tables created!');
  } 
  catch (error) 
  {
    console.error('Error creating database:', error);
  }
})();
