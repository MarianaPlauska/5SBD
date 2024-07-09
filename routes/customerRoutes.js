const express = require('express');
const CustomerRepository = require('../repositories/CustomerRepository');
const router = express.Router();
const customerRepository = new CustomerRepository();

router.post('/', async (req, res) => {
  const customer = req.body;
  const newCustomer = await customerRepository.add(customer);
  res.status(201).json(newCustomer);
});

router.get('/:cpf', async (req, res) => {
  const { cpf } = req.params;
  const customer = await customerRepository.getByCPF(cpf);
  res.json(customer);
});

router.put('/:cpf', async (req, res) => {
  const { cpf } = req.params;
  const customer = req.body;
  await customerRepository.update(cpf, customer);
  res.status(204).send();
});

router.delete('/:cpf', async (req, res) => {
  const { cpf } = req.params;
  await customerRepository.delete(cpf);
  res.status(204).send();
});

router.get('/', async (req, res) => {
  const customers = await customerRepository.getAll();
  res.json(customers);
});

module.exports = router;
