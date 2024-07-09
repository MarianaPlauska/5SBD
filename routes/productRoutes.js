const express = require('express');
const ProductRepository = require('../repositories/ProductRepository');
const router = express.Router();
const productRepository = new ProductRepository();

router.post('/', async (req, res) => {
  const product = req.body;
  const newProduct = await productRepository.add(product);
  res.status(201).json(newProduct);
});

router.get('/:sku', async (req, res) => {
  const { sku } = req.params;
  const product = await productRepository.getBySku(sku);
  res.json(product);
});

router.put('/:sku', async (req, res) => {
  const { sku } = req.params;
  const product = req.body;
  await productRepository.update(sku, product);
  res.status(204).send();
});

router.delete('/:sku', async (req, res) => {
  const { sku } = req.params;
  await productRepository.delete(sku);
  res.status(204).send();
});

router.get('/', async (req, res) => {
  const products = await productRepository.getAll();
  res.json(products);
});

module.exports = router;
