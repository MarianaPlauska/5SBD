const { Product } = require('../models');

class ProductRepository {
  async add(product) {
    return await Product.create(product);
  }

  async getBySku(sku) {
    return await Product.findOne({ where: { sku } });
  }

  async update(sku, product) {
    return await Product.update(product, { where: { sku } });
  }

  async delete(sku) {
    return await Product.destroy({ where: { sku } });
  }

  async getAll() {
    return await Product.findAll();
  }
}

module.exports = ProductRepository;
