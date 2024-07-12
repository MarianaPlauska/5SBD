const express = require('express');
const OrderItem = require('../models/orderItem');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const product = await Product.findByPk(product_id);

    if (!product) 
    {
      return res.status(400).json({ error: 'Produto não encontrado' });
    }

    if (product.available_quantity < quantity) 
    {
      return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
    }

    const item_price = product.price * quantity;

    const newItemPedido = await OrderItem.create({
      ...req.body,
      item_price: item_price
    });

    product.available_quantity -= quantity;
    await product.save();

    res.status(201).json(newItemPedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/:order_item_id', async (req, res) => {
  try {
    const { order_item_id } = req.params;
    const itemPedido = await OrderItem.findOne({ where: { order_item_id } });

    if (itemPedido) 
    {
      res.json(itemPedido);
    } 
    else 
    {
      res.status(404).json({ error: 'Item de pedido não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:order_item_id', async (req, res) => {
  try {
    const { order_item_id } = req.params;
    const itemPedido = req.body;
    const updated = await OrderItem.update(itemPedido, { where: { order_item_id } });

    if (updated[0]) 
    {
      res.status(204).send(); //sem atualização
    } 
    else 
    {
      res.status(404).json({ error: 'Item de pedido não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:order_item_id', async (req, res) => {
  try {
    const { order_item_id } = req.params;
    const deleted = await OrderItem.destroy({ where: { order_item_id } });

    if (deleted) 
    {
      res.status(204).send();
    } 
    else 
    {
      res.status(404).json({ error: 'Item de pedido não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.json(orderItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
