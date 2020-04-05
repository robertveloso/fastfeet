import Mail from '../../lib/Mail';

class CreationDeliveryMail {
  get key() {
    return 'CreationDeliveryMail';
  }

  async handle({ data }) {
    const { deliverer, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliverer.name} <${deliverer.email}>`,
      subject: 'Nova entrega cadastrada',
      template: 'CreationDelivery',
      context: {
        deliverer: deliverer.name,
        product,
        recipient: recipient.name,
        city: recipient.city,
        state: recipient.state,
        street: recipient.street,
        number: recipient.number,
        zip_code: recipient.zip_code,
      },
    });
  }
}

export default new CreationDeliveryMail();
