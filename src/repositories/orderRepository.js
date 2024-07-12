const { Order } = require('../models');

class OrderRepository {
  async add(order) {
    await Order.create(order);
  }
}

module.exports = OrderRepository;
