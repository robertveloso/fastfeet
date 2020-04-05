import { Op } from 'sequelize';

import Deliverer from '../models/Deliverer';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryDeliveredController {
  async index(req, res) {
    const { id: delivererId } = req.params;

    const deliverer = await Deliverer.findByPk(delivererId);

    if (!deliverer) {
      return res.status(400).json({ error: 'Deliverer does not exists' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        signature_id: { [Op.not]: null },
        deliverer_id: delivererId,
      },
      attributes: [
        'id',
        'deliverer_id',
        'product',
        'status',
        'start_date',
        'end_date',
        'canceled_at',
      ],
      order: ['id'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'state',
            'city',
            'street',
            'number',
            'complement',
            'zip_code',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(deliveries);
  }
}

export default new DeliveryDeliveredController();
