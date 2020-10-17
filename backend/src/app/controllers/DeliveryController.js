import { Op, fn, col, where } from 'sequelize';

import Stock from '../models/Stock';
import Delivery from '../models/Delivery';
import Product from '../models/Product';
import Recipient from '../models/Recipient';
import Deliverer from '../models/Deliverer';
import DeliveryProducts from '../models/DeliveryProducts';
import DeliveryStock from '../models/DeliveryStock';

import CreateDeliveryService from '../services/CreateDeliveryService';

import Cache from '../../lib/Cache';

class DeliveryController {
  async store(req, res) {
    const { recipient_id, deliverer_id } = req.body;

    const delivery = await CreateDeliveryService.run({
      recipient_id,
      deliverer_id,
    });

    return res.json(delivery);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      attributes: [
        'id',
        'code',
        'payment_method',
        'fare',
        'discount',
        'received',
        'change',
        'total',
        'status',
      ],
      include: [
        {
          model: DeliveryProducts,
          as: 'deliveriesProducts',
          attributes: ['id', 'product_id', 'order_id', 'price'],
          include: [
            {
              model: Product,
              as: 'products',
              attributes: ['id', 'name', 'price'],
            },
          ],
        },
        {
          model: DeliveryStock,
          as: 'deliveriesStock',
          attributes: [
            'id',
            'product_id',
            'stock_id',
            'order_id',
            'price',
            'quantity',
          ],
          include: [
            {
              model: Stock,
              as: 'stock',
              attributes: ['id', 'name', 'price'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: Deliverer,
          as: 'deliverer',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    return res.json(delivery);
  }

  async index(req, res) {
    const { q: query, code, page = 1 } = req.query;

    const cacheKey = `deliveries`;

    // const cached = await Cache.get(cacheKey);

    // if (cached) return res.json(cached);

    const response = code
      ? await Delivery.findAll({
          where: { code },
          attributes: [
            'id',
            'code',
            'payment_method',
            'fare',
            'discount',
            'received',
            'change',
            'total',
            'status',
            'start_date',
            'end_date',
            'canceled_at',
          ],
          order: [['code', 'DESC']],
          limit: 5,
          offset: (page - 1) * 5,
          include: [
            {
              model: Recipient,
              paranoid: false,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'phone',
                'street',
                'number',
                'district',
                'complement',
              ],
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name'],
            },
          ],
        })
      : query
      ? await Delivery.findAll({
          attributes: [
            'id',
            'code',
            'payment_method',
            'fare',
            'discount',
            'received',
            'change',
            'total',
            'status',
            'start_date',
            'end_date',
            'canceled_at',
          ],
          order: [['code', 'DESC']],
          limit: 5,
          offset: (page - 1) * 5,
          include: [
            {
              model: Recipient,
              paranoid: false,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'phone',
                'street',
                'number',
                'district',
                'complement',
              ],
              where: {
                [Op.or]: [
                  where(fn('unaccent', col('name')), {
                    [Op.iLike]: `%${query}%`,
                  }),
                  {
                    phone: {
                      [Op.iLike]: `${query}%`,
                    },
                  },
                ],
              },
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name'],
            },
          ],
        })
      : await Delivery.findAll({
          attributes: [
            'id',
            'code',
            'payment_method',
            'fare',
            'discount',
            'received',
            'change',
            'total',
            'status',
            'start_date',
            'end_date',
            'canceled_at',
          ],
          order: [['code', 'DESC']],
          limit: 5,
          offset: (page - 1) * 5,
          include: [
            {
              model: Recipient,
              paranoid: false,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'phone',
                'street',
                'number',
                'district',
                'complement',
              ],
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name'],
            },
          ],
        });

    await Cache.set(cacheKey, response);

    return res.json(response);
  }

  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists', code: 'delivery@update/delivery-does-not-exists' });
    }

    const {
      payment_method,
      fare,
      discount,
      received,
      change,
      total,
      products,
      stock,
      recipient_id,
      deliverer_id,
      status,
    } = req.body;

    if (status) {
      await delivery.update({ status });
      await Cache.invalidateRoot(`deliveries`);
      return res.json({});
    }

    await delivery.update({
      payment_method,
      fare,
      discount,
      received,
      change,
      total,
      recipient_id,
      deliverer_id,
    });

    // delete all records with order_id and recreate

    await DeliveryProducts.destroy({
      where: { delivery_id: id },
    });
    await DeliveryStock.destroy({
      where: { delivery_id: id },
    });

    products.map(product => {
      DeliveryProducts.create({
        delivery_id: id,
        product_id: product.id,
        order_id: product.uuid,
        price: product.price,
      });
    });
    stock.map(stock => {
      DeliveryStock.create({
        delivery_id: id,
        product_id: stock.productId,
        stock_id: stock.id,
        order_id: stock.orderUUID,
        quantity: stock.quantity,
        price: stock.price,
      });
    });

    await Cache.invalidateRoot(`deliveries`);
    return res.json({});
  }

  async destroy(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists', code: 'delivery@destroy/delivery-does-not-exists' });
    }

    if (delivery.start_date) {
      return res.status(400).json({ error: 'This Delivery already been sent' });
    }

    if (delivery.status === 'PENDENTE') {
      return res
        .status(400)
        .json({ error: 'This delivery must receive new status first', code: 'delivery@destroy/requires-new-status' });
    }

    await delivery.destroy();
    await Cache.invalidateRoot(`deliveries`);
    return res.json({});
  }
}

export default new DeliveryController();
