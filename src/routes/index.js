const express = require('express');
const router = express.Router();

const customerRoutes = require('./customerRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const orderItemRoutes = require('./orderItemRoutes');

// Registrar todas as rotas
router.use('/customerRoutes', customerRoutes);
router.use('/productRoutes', productRoutes);
router.use('/orderRoutes', orderRoutes);
router.use('/orderItemRoutes', orderItemRoutes);

module.exports = router;
















































// const express = require('express');
// const sequelize = require('../config/database');
// const Customer = require('../models/customer');
// const Product = require('../models/product');
// const Order = require('../models/order');
// const OrderItem = require('../models/orderItem');

// const app = express();
// app.use(express.json());

// // CRUD para Customer
// app.post('/models/customers', async (req, res) => {
//   try {
//     const customer = await Customer.create(req.body);
//     res.status(201).json(customer);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/models/customers/:cpf', async (req, res) => {
//   try {
//     const customer = await Customer.findOne({ where: { cpf: req.params.cpf } });
//     if (customer) {
//       res.json(customer);
//     } else {
//       res.status(404).json({ error: 'Customer not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.put('/models/customers/:cpf', async (req, res) => {
//   try {
//     const customer = await Customer.findOne({ where: { cpf: req.params.cpf } });
//     if (customer) {
//       await customer.update(req.body);
//       res.json(customer);
//     } else {
//       res.status(404).json({ error: 'Customer not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.delete('/models/customers/:cpf', async (req, res) => {
//   try {
//     const customer = await Customer.findOne({ where: { cpf: req.params.cpf } });
//     if (customer) {
//       await customer.destroy();
//       res.status(204).end();
//     } else {
//       res.status(404).json({ error: 'Customer not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // CRUD para Product
// app.post('/models/products', async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/models/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404).json({ error: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.put('/models/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (product) {
//       await product.update(req.body);
//       res.json(product);
//     } else {
//       res.status(404).json({ error: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.delete('/models/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (product) {
//       await product.destroy();
//       res.status(204).end();
//     } else {
//       res.status(404).json({ error: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // CRUD para Order
// app.post('/models/orders', async (req, res) => {
//   try {
//     const order = await Order.create({ ...req.body, purchase_date: new Date() });
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/models/orders/:id', async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id, {
//       include: [OrderItem]
//     });
//     if (order) {
//       res.json(order);
//     } else {
//       res.status(404).json({ error: 'Order not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // CRUD para OrderItem
// app.post('/models/orders/:orderId/items', async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.orderId);
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     const product = await Product.findByPk(req.body.product_id);
//     if (!product || product.available_quantity < req.body.quantity) {
//       return res.status(400).json({ error: 'Invalid product or insufficient quantity' });
//     }

//     const orderItem = await OrderItem.create({
//       ...req.body,
//       order_id: req.params.orderId,
//       item_price: product.price
//     });

//     product.available_quantity -= req.body.quantity;
//     await product.save();

//     res.status(201).json(orderItem);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/models/orders/:orderId/items/:itemId', async (req, res) => {
//   try {
//     const orderItem = await OrderItem.findOne({ where: { id: req.params.itemId, order_id: req.params.orderId } });
//     if (orderItem) {
//       res.json(orderItem);
//     } else {
//       res.status(404).json({ error: 'OrderItem not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.put('/api/orders/:orderId/items/:itemId', async (req, res) => {
//     try {
//       const orderItem = await OrderItem.findOne({ where: { id: req.params.itemId, order_id: req.params.orderId } });
//       if (orderItem) {
//         await orderItem.update(req.body);
//         res.json(orderItem);
//       } else {
//         res.status(404).json({ error: 'OrderItem not found' });
//       }
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   });
  
