const { OrderItem } = require('../models');

class OrderItemRepository {
  async add(orderItem) {
    return await OrderItem.create(orderItem);
  }

  async getById(id) {
    return await OrderItem.findOne({ where: { id } });
  }

  async update(id, orderItem) {
    return await OrderItem.update(orderItem, { where: { id } });
  }

  async delete(id) {
    return await OrderItem.destroy({ where: { id } });
  }

  async getAll() {
    return await OrderItem.findAll();
  }
}

module.exports = OrderItemRepository;
