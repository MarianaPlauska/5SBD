const CustomerRepository = require('../repositories/CustomerRepository');
const customerRepository = new CustomerRepository();

module.exports = {
  async create(req, res)
   {
    const customer = req.body; //dados para o banco
    await customerRepository.add(customer);
    res.status(201).send(customer);
  },

  async getByCPF(req, res)
   {
    const cpf = req.params.cpf;
    const customer = await customerRepository.getByCPF(cpf);

    if (customer)
    {
      res.status(200).send(customer);
    } 
    else 
    {
      res.status(404).send({ message: 'Cliente não encontrado' });
    }
  }
};

//require função nativa para criar módulos
