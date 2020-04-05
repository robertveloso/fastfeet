import Delivery from '../models/Delivery';

import DeliveryProblem from '../schemas/DeliveryProblem';
import CancelDeliveryService from '../services/CancelDeliveryService';

import Cache from '../../lib/Cache';

class DeliveryProblemController {
  async store(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'This delivery has not been withdrawn' });
    }

    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'This deliery already be canceled' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(deliveryProblem);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const perPage = 5;

    const cacheKey = `deliveryProblems:${page}`;

    const cached = await Cache.get(cacheKey);

    if (cached) return res.json(cached);

    const deliveryProblems = await DeliveryProblem.find()
      .skip((page - 1) * 5)
      .limit(perPage);

    await Cache.set(cacheKey, deliveryProblems);

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const deliveryProblems = await DeliveryProblem.find({ delivery_id: id });

    return res.json(deliveryProblems);
  }

  async destroy(req, res) {
    // Request for cancel delivery and send mail
    const delivery = await CancelDeliveryService.run({
      id: req.params.id,
    });

    return res.json(delivery);
  }
}

export default new DeliveryProblemController();
