const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');

app.use('/api/customer', customerRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/orderItem', orderItemRoutes);

const sequelize = require('./config/database');

// Sincronizar o banco de dados
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});




































// const express = require('express');
// const sequelize = require('./config/database');
// const customerRoutes = require('./routes/customerRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const orderItemRoutes = require('./routes/orderItemRoutes');

// const app = express();
// const PORT = 3000;

// app.use(express.json());

// app.use('/api/customer', customerRoutes);
// app.use('/api/product', productRoutes);
// app.use('/api/order', orderRoutes);
// app.use('/api/orderItem', orderItemRoutes);

// app.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);
//   await sequelize.sync({ force: true }); // Sincronize o banco de dados (apenas para desenvolvimento)
// });
