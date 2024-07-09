const express = require('express');
const OrderRepository = require('../repositories/OrderRepository');
const router = express.Router();
const orderRepository = new OrderRepository();

router.post('/', async (req, res) => {
  const order = req.body;
  const newOrder = await orderRepository.add(order);
  res.status(201).json(newOrder);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const order = await orderRepository.getById(id);
  res.json(order);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const order = req.body;
  await orderRepository.update(id, order);
  res.status(204).send();
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await orderRepository.delete(id);
  res.status(204).send();
});

router.get('/', async (req, res) => {
  const orders = await orderRepository.getAll();
  res.json(orders);
});

module.exports = router;
