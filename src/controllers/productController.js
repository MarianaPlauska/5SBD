const ProductRepository = require('../repositories/productRepository');
const productRepository = new ProductRepository();

module.exports = {
  async create(req, res) 
  {
    const product = req.body;
    await productRepository.add(product);
    res.status(201).send(product);
  },

  async getBySku(req, res) 
  {
    const sku = req.params.sku;
    const product = await productRepository.getBySku(sku);

    if (product) 
    {
      res.status(200).send(product);
    } 
    else 
    {
      res.status(404).send({ message: 'Produto não encontrado' });
    }
  },

  async update(req, res) 
  {
    const sku = req.params.sku;
    const product = req.body;
    await productRepository.update(product);
    res.status(200).send(product);
  }
};
