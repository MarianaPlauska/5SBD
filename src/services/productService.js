const axios = require('axios');
const Product = require('../models/product');

const fetchProductsFromMarketplace = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.products;
  } catch (error) {
    console.error('Erro ao buscar produtos do marketplace:', error);
    throw error;
  }
};

const syncProducts = async (marketplaceUrls) => {
  for (const url of marketplaceUrls) {
    const products = await fetchProductsFromMarketplace(url);
    for (const product of products) {
      await Product.findOrCreate({
        where: { upc: product.upc },
        defaults: {
          name: product.name,
          price: product.price
        }
      });
    }
  }
};

module.exports = { syncProducts };
