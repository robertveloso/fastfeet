import { Op, fn, col, where } from 'sequelize';

import Product from '../models/Product';
import File from '../models/File';
import Stock from '../models/Stock';
import StockProducts from '../models/StockProducts';
import DeliveryProducts from '../models/DeliveryProducts';

class ProductController {
  async store(req, res) {
    const { name, price, components, description, type, avatar_id } = req.body;

    const productExists = await Product.findOne({ where: { name } });

    if (productExists) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    const product = await Product.create({
      name,
      price,
      description,
      type,
      avatar_id,
    });

    await StockProducts.destroy({
      where: { product_id: product.id },
    });

    components.map(component => {
      StockProducts.create({
        stock_id: component,
        product_id: product.id,
      });
    });

    return res.json({ id: product.id, name, price, avatar_id });
  }

  async show(req, res) {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: [
        'id',
        'code',
        'name',
        'price',
        'description',
        'type',
        'created_at',
      ],
      include: [
        {
          model: Stock,
          as: 'stock',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!product) {
      return res.status(400).json({ error: 'Product does not exists' });
    }

    return res.json(product);
  }

  async index(req, res) {
    const { q: query, code, page = 1 } = req.query;

    const response = code
      ? await Product.findAll({
          where: { code },
          order: [['code', 'DESC']],
          attributes: ['id', 'code', 'name', 'price', 'description', 'type'],
          limit: 5,
          offset: (page - 1) * 5,
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        })
      : query
      ? await Product.findAll({
          where: {
            [Op.or]: [
              where(fn('unaccent', col('Product.name')), {
                [Op.iLike]: `%${query}%`,
              }),
            ],
          },
          order: [['code', 'DESC']],
          attributes: ['id', 'code', 'name', 'price', 'description', 'type'],
          limit: 5,
          offset: (page - 1) * 5,
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        })
      : await Product.findAll({
          order: [['code', 'DESC']],
          attributes: ['id', 'code', 'name', 'price', 'description', 'type'],
          limit: 5,
          offset: (page - 1) * 5,
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        });

    return res.json(response);
  }

  async update(req, res) {
    const { name, price, components, description, type, avatar_id } = req.body;

    if (avatar_id) {
      const avatarExists = await File.findByPk(avatar_id);

      if (!avatarExists) {
        return res.status(400).json({ error: 'File does not exists' });
      }
    }

    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(400).json({ error: 'Product does not exists' });
    }

    if (name !== product.name) {
      const productExists = await Product.findOne({ where: { name } });

      if (productExists) {
        return res.status(400).json({ error: 'Product already exists.' });
      }
    }

    await product.update({ name, price, description, type, avatar_id });

    await StockProducts.destroy({
      where: { product_id: id },
    });

    components.map(component => {
      StockProducts.create({
        stock_id: component,
        product_id: id,
      });
    });
    // product.setStock(components);

    const { avatar } = await Product.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, name, price, description, type, avatar });
  }

  async destroy(req, res) {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(400).json({ error: 'Product does not exists' });
    }

    const deliveries_product = await DeliveryProducts.findOne({
      where: { product_id: id },
    });

    if (deliveries_product) {
      return res
        .status(400)
        .json({ error: "This Product can't be deleted, delivery uses it" });
    }

    await product.destroy();

    return res.json({});
  }
}

export default new ProductController();
