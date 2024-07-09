const express = require('express');
const bodyParser = require('body-parser');
const customerRoutes = require('../routes/customerRoutes');
const orderRoutes = require('../routes/orderRoutes');
const orderItemRoutes = require('../routes/orderItemRoutes');
const productRoutes = require('../routes/productRoutes');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/order-items', orderItemRoutes);
app.use('/products', productRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
