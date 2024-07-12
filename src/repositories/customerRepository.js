const { Customer } = require('../models');

class CustomerRepository {
  async add(customer) {
    await Customer.create(customer);
  }

  async getByCPF(cpf) {
    return await Customer.findOne({ where: { cpf } });
  }
}

module.exports = CustomerRepository;
