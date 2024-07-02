const express = require('express');
const app = express();
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const sequelize = require('./config/database');

app.use(express.json());

app.use('/api', productController);
app.use('/api', orderController);

const PORT = process.env.PORT || 3000;

const init = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
  }
};

init();
