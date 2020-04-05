import { parseISO, isAfter, isBefore, setHours } from 'date-fns';

import Deliverer from '../models/Deliverer';
import Delivery from '../models/Delivery';

class DeliveryWithDrawController {
  async update(req, res) {
    const { delivererId, deliveryId } = req.params;

    const deliverer = await Deliverer.findByPk(delivererId);

    if (!deliverer) {
      return res.status(400).json({ error: 'Delivery man does not exists' });
    }

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const { count } = await Delivery.findAndCountAll({
      where: {
        deliverer_id: delivererId,
        start_date: null,
        signature_id: null,
      },
    });

    if (count === 5) {
      return res
        .status(400)
        .json({ error: 'Maximum number of withdrawals reached' });
    }

    const { start_date } = req.body;
    const start_date_ISO = parseISO(start_date);

    if (
      isBefore(start_date_ISO, setHours(new Date(), 8)) ||
      isAfter(start_date_ISO, setHours(new Date(), 18))
    ) {
      return res.status(400).json({ error: 'Invalid time' });
    }

    await delivery.update({ start_date, status: 'RETIRADA' });

    return res.json({});
  }
}

export default new DeliveryWithDrawController();
