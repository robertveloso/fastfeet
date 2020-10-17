import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      payment_method: Yup.number().integer().notRequired(),
      fare: Yup.number().notRequired(),
      discount: Yup.number().notRequired(),
      received: Yup.number().notRequired(),
      change: Yup.number().notRequired(),
      total: Yup.number().notRequired(),
      products: Yup.array().notRequired(),
      stock: Yup.array().notRequired(),
      recipient_id: Yup.string().required(),
      deliverer_id: Yup.string().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messsages: error.inner });
  }
};
