const { Order } = require('../models');

class OrderRepository {
  async add(order) {
    return await Order.create(order);
  }

  async getById(id) {
    return await Order.findOne({ where: { id } });
  }

  async update(id, order) {
    return await Order.update(order, { where: { id } });
  }

  async delete(id) {
    return await Order.destroy({ where: { id } });
  }

  async getAll() {
    return await Order.findAll();
  }
}

module.exports = OrderRepository;
