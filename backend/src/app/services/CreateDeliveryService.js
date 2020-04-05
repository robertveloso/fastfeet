import Recipient from '../models/Recipient';
import Deliverer from '../models/Deliverer';
import Delivery from '../models/Delivery';

import CreationDeliveryMail from '../jobs/CreationDeliveryMail';

import Error from '../../error';

import Cache from '../../lib/Cache';
import Queue from '../../lib/Queue';

class CreateDeliveryService {
  async run({ product, recipient_id, deliverer_id }) {
    /*
     * Check if recipient exists
     */
    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      throw new Error({
        status: 400,
        message: 'Recipient does not exists',
      });
    }

    /*
     * Check if recipient exists
     */
    const deliverer = await Deliverer.findByPk(deliverer_id);

    if (!deliverer) {
      throw new Error({
        status: 400,
        message: 'Deliverer does not exists',
      });
    }

    const {
      id,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    } = await Delivery.create({
      product,
      recipient_id,
      deliverer_id,
      status: 'PENDENTE',
    });

    /**
     * Invalidate Cache
     */
    await Cache.invalidateRoot(`deliveries`);

    await Queue.add(CreationDeliveryMail.key, {
      deliverer,
      recipient: recipientExists,
      product,
    });

    return {
      id,
      product,
      recipient_id,
      deliverer_id,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    };
  }
}

export default new CreateDeliveryService();
