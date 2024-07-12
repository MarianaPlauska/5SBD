const express = require('express');
const Product = require('../models/product'); // Corrija a importação
const router = express.Router();

// Verificar todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar um produto específico
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) 
    {
      res.json(product);
    } 
    else 
    {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Adicionar produto
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body); 
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id); 

    if (product) 
    {
      await product.update(req.body);
      res.json(product);
    }
    else 
    {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id); 

    if (product) 
    {
      await product.destroy();
      res.status(204).end();
    }
    else 
    {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
