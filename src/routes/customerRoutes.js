// routes/customerRoutes.js
const express = require('express');
const Customer = require('../models/customer');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cpf', async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { cpf: req.params.cpf } });
    if (customer) 
    {
      res.json(customer);
    } 
    else 
    {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:cpf', async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { cpf: req.params.cpf } });
    if (customer) 
    {
      await customer.update(req.body);
      res.json(customer);
    } 
    else 
    {
      res.status(404).json({ error: 'Cliete não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:cpf', async (req, res) => {
  try {
    console.log(`Pedido paradeletar cliete cpf: ${req.params.cpf}`);
    const customer = await Customer.findOne({ where: { cpf: req.params.cpf } });

    if (customer) 
    {
      await customer.destroy();
      res.status(204).end();
    } 
    else 
    {
      res.status(404).json({ error: 'Cliete ão ecotrado' });
    }
  } catch (error) {
    console.error(`Erro ao tentar deletar cliente CPF: ${req.params.cpf}`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
