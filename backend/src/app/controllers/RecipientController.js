import { Op, fn, col, where } from 'sequelize';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';

class RecipientController {
  async store(req, res) {
    Object.keys(req.body).forEach(function(key, index) {
      if (this[key] == '') this[key] = null;
    }, req.body);

    const {
      name,
      phone,
      mail,
      street,
      number,
      district,
      complement,
    } = req.body;

    const { id } = await Recipient.create({
      name,
      phone,
      mail,
      street,
      number,
      district,
      complement,
    });

    return res.json({
      id,
      name,
      phone,
      mail,
      street,
      number,
      district,
      complement,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    Object.keys(req.body).forEach(function(key, index) {
      if (this[key] == '') this[key] = null;
    }, req.body);

    const {
      name,
      phone,
      mail,
      street,
      number,
      district,
      complement,
    } = req.body;

    await recipient.update({
      name,
      phone,
      mail,
      street,
      number,
      district,
      complement,
    });

    return res.json({});
  }

  async index(req, res) {
    const { q: query, code, page = 1 } = req.query;

    const response = code
      ? await Recipient.findAll({
          where: { code },
          order: [['code', 'DESC']],
          attributes: [
            'id',
            'code',
            'name',
            'phone',
            'mail',
            'street',
            'number',
            'district',
            'complement',
          ],
          limit: 5,
          offset: (page - 1) * 5,
        })
      : query
      ? await Recipient.findAll({
          where: {
            [Op.or]: [
              where(fn('unaccent', col('Recipient.name')), {
                [Op.iLike]: `%${query}%`,
              }),
              {
                phone: {
                  [Op.iLike]: `${query}%`,
                },
              },
            ],
          },
          order: [['code', 'DESC']],
          attributes: [
            'id',
            'code',
            'name',
            'phone',
            'mail',
            'street',
            'number',
            'district',
            'complement',
          ],
          limit: 5,
          offset: (page - 1) * 5,
        })
      : await Recipient.findAll({
          order: [['code', 'DESC']],
          attributes: [
            'id',
            'code',
            'name',
            'phone',
            'mail',
            'street',
            'number',
            'district',
            'complement',
          ],
          limit: 5,
          offset: (page - 1) * 5,
        });

    return res.json(response);
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id, {
      attributes: [
        'id',
        'code',
        'name',
        'phone',
        'mail',
        'street',
        'number',
        'district',
        'complement',
      ],
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    return res.json(recipient);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const deliveries = await Delivery.findOne({
      where: {
        recipient_id: recipient.id,
        status: 'PENDENTE',
      },
    });

    if (deliveries) {
      return res
        .status(400)
        .json({ error: 'This Recipient still has an delivery to receive' });
    }

    await recipient.destroy();
    return res.json({});
  }
}

export default new RecipientController();
