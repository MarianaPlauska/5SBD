const express = require('express');
const router = express.Router();
const { syncProducts } = require('../services/productService');
const Product = require('../models/product');

const marketplaceUrls = [
  'URL_DA_API_DA_AMAZON',
  'URL_DA_API_DO_MERCADO_LIVRE'
];

router.get('/products', async (req, res) => {
  try {
    await syncProducts(marketplaceUrls);
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

router.get('/products/:upc', async (req, res) => {
  try {
    const product = await Product.findOne({ where: { upc: req.params.upc } });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

module.exports = router;
