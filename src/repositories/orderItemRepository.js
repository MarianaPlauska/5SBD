const { OrderItem } = require('../models');

class OrderItemRepository {
  async add(orderItem) {
    await OrderItem.create(orderItem);
  }
}

module.exports = OrderItemRepository;
