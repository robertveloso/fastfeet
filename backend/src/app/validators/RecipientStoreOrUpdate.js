import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      phone: Yup.string(),
      mail: Yup.string().email(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      neighborhood: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.string(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messsages: error.inner });
  }
};
