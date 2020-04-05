import { Op } from 'sequelize';

import Deliverer from '../models/Deliverer';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryFinishController {
  async update(req, res) {
    const { delivererId, deliveryId } = req.params;

    const deliverer = await Deliverer.findByPk(delivererId);

    if (!deliverer) {
      return res.status(400).json({ error: 'Deliverer does not exists' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        start_date: { [Op.not]: null },
        signature_id: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const { signature_id } = req.body;

    const signatureImage = await File.findByPk(signature_id);

    if (!signatureImage) {
      return res.status(400).json({ error: 'Signature image does not exists' });
    }

    await delivery.update({
      end_date: new Date(),
      signature_id,
      status: 'ENTREGUE',
    });

    return res.json({});
  }
}

export default new DeliveryFinishController();
