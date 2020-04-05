import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliverer from '../models/Deliverer';
import Recipient from '../models/Recipient';
import File from '../models/File';

import CreateDeliveryService from '../services/CreateDeliveryService';

import Cache from '../../lib/Cache';

class DeliveryController {
  async store(req, res) {
    const { product, recipient_id, deliverer_id } = req.body;

    const delivery = await CreateDeliveryService.run({
      product,
      recipient_id,
      deliverer_id,
    });

    return res.json(delivery);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
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
    const { q: productName, page = 1 } = req.query;

    const cacheKey = `deliveries`;

    const cached = await Cache.get(cacheKey);

    if (cached) return res.json(cached);

    const response = productName
      ? await Delivery.findAll({
          where: {
            product: {
              [Op.iLike]: `${productName}%`,
            },
          },
          order: ['id'],
          attributes: [
            'id',
            'product',
            'status',
            'start_date',
            'end_date',
            'canceled_at',
          ],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              paranoid: false,
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'city',
                'state',
                'zip_code',
              ],
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name'],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'url', 'path'],
            },
          ],
        })
      : await Delivery.findAll({
          attributes: [
            'id',
            'product',
            'status',
            'start_date',
            'end_date',
            'canceled_at',
          ],
          order: ['id'],
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
                'street',
                'number',
                'city',
                'state',
                'zip_code',
              ],
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name'],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'url', 'path'],
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
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const { product, recipient_id, deliverer_id } = req.body;

    await delivery.update({ product, recipient_id, deliverer_id });
    await Cache.invalidateRoot(`deliveries`);
    return res.json({});
  }

  async destroy(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    if (delivery.start_date) {
      return res.status(400).json({ error: 'This Delivery already been sent' });
    }

    await delivery.destroy();
    await Cache.invalidateRoot(`deliveries`);
    return res.json({});
  }
}

export default new DeliveryController();
