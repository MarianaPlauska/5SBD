const OrderRepository = require('../repositories/orderRepository');

const Cliente = require("../models/cliente");
const Produto = require("../models/produto");
const Pedido = require("../models/pedido");
const ItensPedido = require("../models/itensPedido");
const Estoque = require("../models/estoque");
const { Sequelize } = require("sequelize");

async function calculateOrder(order_id) {
  const items = await ItensPedido.findAll({ where: { order_id } });
  let total = 0;

  for (const item of items)
  {
    const produto = await Produto.findOne({ where: { sku: item.sku } });
    total += item.quantity_purchased * produto.item_price;
  }

  await Pedido.update({ total_price: total }, { where: { order_id } });
}

module.exports = {
  async create(req, res) {
    const t = await Sequelize.transaction();

    try {
      const order = req.body;
      const { order_id, cpf, items } = order;

      let cliente = await Cliente.findOne({ where: { cpf } });
      
      if (!cliente) 
      {
        cliente = await Cliente.create({ cpf, ...req.body }, { transaction: t });
      }

      let pedido = await Pedido.findOne({ where: { order_id } });
      
      if (!pedido) 
      {
        pedido = await Pedido.create({ order_id, cpf, ...req.body }, { transaction: t });
      }


      for (const item of items) 
      {
   
        let produto = await Produto.findOne({ where: { sku: item.sku } });
        if (!produto) 
        {
          produto = await Produto.create({
            sku: item.sku,
            product_name: item.product_name,
            item_price: item.item_price,
            currency: item.currency,
          }, { transaction: t });
        }
        
        const estoque = await Estoque.findOne({ where: { sku: item.sku } });
        
        if (!estoque || estoque.quantity < item.quantity_purchased) 
        {
          throw new Error(`Estoque insuficiente para o SKU ${item.sku}`);
        }

        let itemPedido = await ItensPedido.findOne({ where: { order_item_id: item.order_item_id } });
        
        if (!itemPedido) 
        {
          itemPedido = await ItensPedido.create({
            order_item_id: item.order_item_id,
            order_id,
            sku: item.sku,
            quantity_purchased: item.quantity_purchased,
          }, { transaction: t });
        }

        await Estoque.update(
          { quantity: estoque.quantity - item.quantity_purchased },
          { where: { sku: item.sku }, transaction: t }
        );
      }

      await calculateOrder(order_id);

      await t.commit();

      res.status(201).json({ message: "Pedido processado", order });
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: "Erro ao processar pedido.", details: error.message });
    }
  },

  async getById(req, res) {
    try {
      const id = req.params.id;
      const order = await orderRepository.getById(id);

      if (order) 
      {
        res.status(200).send(order);
      } else {
        res.status(404).send({ message: 'Pedido não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: "Erro ao buscar pedido.", details: error.message });
    }
  }
};
