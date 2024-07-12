const express = require('express');
const Order = require('../models/order');
const Product = require('../models/product');
const OrderItem = require('../models/orderItem');
const router = express.Router();

// Função para recalcular o total do pedido
async function recalculateOrderTotal(orderId) {
  const items = await OrderItem.findAll({ where: { order_id: orderId } });

  //somar o total de todos os itens do pedido
  const total = items.reduce((sum, item) => sum + item.quantity * item.item_price, 0);

  //salvar e atualizar o total do pedido
  await Order.update({ total_price: total }, { where: { id: orderId } });
}

// Verificar os pedidos
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: { model: OrderItem, as: 'items' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar um pedido específico
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: { model: OrderItem, as: 'items' }
    });

    if (order) 
    {
      res.json(order);
    } 
    else 
    {
      res.status(404).json({ error: 'Pedido não ecotrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//criaropedido
router.post('/', async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, purchase_date: new Date() });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Adicionar Item ao Pedido
router.post('/:orderId/items', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);

    if (!order) 
    {
      return res.status(404).json({ error: 'Pedido não  encotrado' });
    }

    const productId = req.body.product_id; // Produto que está sendo adicionado ao pedido
    const product = await Product.findByPk(productId);

    if (!product) 
    {
      return res.status(400).json({ error: 'Produto não encontrado' });
    }

    if (product.available_quantity < req.body.quantity) 
    {
      return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
    }

    const itemOrder = await OrderItem.create({
      ...req.body,
      order_id: req.params.orderId,
      item_price: product.price,
      product_id: productId // Incluir o ID do produto no item do pedido
    });

    product.available_quantity -= req.body.quantity;
    await product.save();

    await recalculateOrderTotal(req.params.orderId);

    res.status(201).json(itemOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar Item do Pedido
router.put('/:orderId/items/:itemId', async (req, res) => {
  try {
    const itemOrder = await OrderItem.findByPk(req.params.itemId);

    if (!itemOrder) 
    {
      return res.status(404).json({ error: 'Item do pedido não encontrado' });
    }

    const product = await Product.findByPk(itemOrder.product_id);

    if (!product) 
    {
      return res.status(400).json({ error: 'Produto não encontrado' });
    }

    const newQuantity = req.body.quantity;
    const quantityDifference = newQuantity - itemOrder.quantity;

    if (product.available_quantity < quantityDifference) 
    {
      return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
    }

    await itemOrder.update({ quantity: newQuantity });
    product.available_quantity -= quantityDifference;
    await product.save();

    await recalculateOrderTotal(req.params.orderId);

    res.status(200).json(itemOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar Item do Pedido
router.delete('/:orderId/items/:itemId', async (req, res) => {
  try {
    const itemOrder = await OrderItem.findByPk(req.params.itemId);

    if (!itemOrder) 
    {
      return res.status(404).json({ error: 'Item do pedido não encontrado' });
    }

    const product = await Product.findByPk(itemOrder.product_id);
    product.available_quantity += itemOrder.quantity;
    await product.save();

    await itemOrder.destroy();

    await recalculateOrderTotal(req.params.orderId);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
