import { Op, fn, col, where } from 'sequelize';

import Stock from '../models/Stock';
import File from '../models/File';
import DeliveryStock from '../models/DeliveryStock';
import StockProducts from '../models/StockProducts';

class StockController {
  async store(req, res) {
    const { name, price, quantity, notes, avatar_id } = req.body;

    const stockExists = await Stock.findOne({ where: { name } });

    if (stockExists) {
      return res.status(400).json({ error: 'Stock already exists' });
    }

    const { id } = await Stock.create({
      name,
      price,
      quantity,
      notes,
      avatar_id,
    });

    return res.json({
      id,
      name,
      price,
      quantity,
      notes,
      avatar_id,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const stock = await Stock.findByPk(id, {
      attributes: [
        'id',
        'code',
        'name',
        'price',
        'quantity',
        'notes',
        'created_at',
      ],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!stock) {
      return res.status(400).json({ error: 'Stock does not exists' });
    }

    return res.json(stock);
  }

  async index(req, res) {
    const { q: query, code, page = 1 } = req.query;

    const response = code
      ? await Stock.findAll({
          where: { code },
          order: [['code', 'DESC']],
          attributes: ['id', 'code', 'name', 'price', 'quantity', 'notes'],
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
      ? await Stock.findAll({
          where: {
            [Op.or]: [
              where(fn('unaccent', col('Stock.name')), {
                [Op.iLike]: `%${query}%`,
              }),
            ],
          },
          order: [['code', 'DESC']],
          attributes: ['id', 'code', 'name', 'price', 'quantity', 'notes'],
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
      : await Stock.findAll({
          order: [['code', 'DESC']],
          attributes: ['id', 'code', 'name', 'price', 'quantity', 'notes'],
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
    const { name, price, quantity, notes, avatar_id } = req.body;

    if (avatar_id) {
      const avatarExists = await File.findByPk(avatar_id);

      if (!avatarExists) {
        return res.status(400).json({ error: 'File does not exists' });
      }
    }

    const { id } = req.params;

    const stock = await Stock.findByPk(id);

    if (!stock) {
      return res.status(400).json({ error: 'Stock does not exists' });
    }

    if (name !== stock.name) {
      const stockExists = await Stock.findOne({ where: { name } });

      if (stockExists) {
        return res.status(400).json({ error: 'Stock already exists.' });
      }
    }

    await stock.update({ name, price, quantity, notes, avatar_id });

    const { avatar } = await Stock.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, name, price, avatar });
  }

  async destroy(req, res) {
    const { id } = req.params;

    const stock = await Stock.findByPk(id);

    if (!stock) {
      return res.status(400).json({ error: 'Stock does not exists' });
    }

    const stock_products = await StockProducts.findOne({
      where: { stock_id: id },
    });

    if (stock_products) {
      return res
        .status(400)
        .json({ error: "This Stock can't be deleted, StockProducts uses it" });
    }

    const deliveries_stock = await DeliveryStock.findOne({
      where: { stock_id: id },
    });

    if (deliveries_stock) {
      return res
        .status(400)
        .json({ error: "This Stock can't be deleted, Delivery uses it" });
    }

    await stock.destroy();

    return res.json({});
  }
}

export default new StockController();
