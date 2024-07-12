const { Product } = require('../models');

class ProductRepository {
  async add(product) {
    await Product.create(product);
  }

  async getBySku(sku) {
    return await Product.findOne({ where: { sku } });
  }

  async update(product) {
    await Product.update(product, { where: { sku: product.sku } });
  }
}

module.exports = ProductRepository;
