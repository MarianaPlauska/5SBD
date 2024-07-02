const axios = require('axios');
const Order = require('../models/order');
const Product = require('../models/product');

const createOrder = async (orderData) => {
  const { status, deliveryAddress, productId } = orderData;
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Produto não encontrado');
  }
  return await Order.create({ status, deliveryAddress, productId });
};

const fetchOrdersFromMarketplace = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.orders;
  } catch (error) {
    console.error('Erro ao buscar pedidos do marketplace:', error);
    throw error;
  }
};

const syncOrders = async (marketplaceUrls) => {
  for (const url of marketplaceUrls) {
    const orders = await fetchOrdersFromMarketplace(url);
    for (const order of orders) {
      const product = await Product.findOne({ where: { upc: order.productUpc } });
      if (product) {
        await Order.create({
          status: order.status,
          deliveryAddress: order.deliveryAddress,
          productId: product.id
        });
      } else {
        console.error(`Produto com UPC ${order.productUpc} não encontrado no banco de dados.`);
      }
    }
  }
};

module.exports = { createOrder, syncOrders };
