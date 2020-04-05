import Recipient from '../models/Recipient';
import Deliverer from '../models/Deliverer';
import Delivery from '../models/Delivery';

import CancellationDeliveryMail from '../jobs/CancellationDeliveryMail';

import Error from '../../error';

import Cache from '../../lib/Cache';
import Queue from '../../lib/Queue';

class CancelDeliveryService {
  async run({ id }) {
    const { delivery_id, description } = await DeliveryProblem.findById(id);

    const delivery = await Delivery.findByPk(delivery_id, {
      include: [
        {
          model: Deliverer,
          as: 'deliverer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
        },
      ],
    });

    if (delivery.canceled_at)
      throw new Error({
        status: 401,
        message: 'Already canceled.',
      });

    await delivery.update({ canceled_at: new Date(), status: 'CANCELADA' });
    await DeliveryProblem.findByIdAndDelete(id);

    /**
     * Invalidate Cache
     */
    await Cache.invalidateRoot(`deliveryProblems`);

    await Queue.add(CancellationDeliveryMail.key, {
      deliverer: delivery.deliverer,
      description,
      recipient: delivery.recipient,
      product: delivery.product,
    });

    return res.json({});
  }
}

export default new CancelDeliveryService();
