const express = require('express');
const router = express.Router();
const { createOrder, syncOrders } = require('../services/orderService');
const Order = require('../models/order');

const marketplaceUrls = [
  'URL_DA_API_DA_AMAZON',
  'URL_DA_API_DO_MERCADO_LIVRE'
];

router.post('/orders', async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    await syncOrders(marketplaceUrls);
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

module.exports = router;
