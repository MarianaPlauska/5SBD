const express = require('express');
const OrderItemRepository = require('../repositories/OrderItemRepository');
const router = express.Router();
const orderItemRepository = new OrderItemRepository();

router.post('/', async (req, res) => {
  const orderItem = req.body;
  const newOrderItem = await orderItemRepository.add(orderItem);
  res.status(201).json(newOrderItem);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const orderItem = await orderItemRepository.getById(id);
  res.json(orderItem);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const orderItem = req.body;
  await orderItemRepository.update(id, orderItem);
  res.status(204).send();
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await orderItemRepository.delete(id);
  res.status(204).send();
});

router.get('/', async (req, res) => {
  const orderItems = await orderItemRepository.getAll();
  res.json(orderItems);
});

module.exports = router;
