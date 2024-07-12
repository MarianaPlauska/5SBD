const OrderRepository = require('../repositories/orderRepository');
const orderRepository = new OrderRepository();

module.exports = {
  async create(req, res)
  {
    const order = req.body;
    await orderRepository.add(order);
    res.status(201).send(order);
  },

  async getById(req, res)
   {
    const id = req.params.id;
    const order = await orderRepository.getById(id);

    if (order)
    {
      res.status(200).send(order);
    } 
    else
    {
      res.status(404).send({ message: 'Pedido não encontrado' });
    }
  }
};
