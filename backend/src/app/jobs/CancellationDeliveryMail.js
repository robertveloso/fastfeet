import Mail from '../../lib/Mail';

class CancellationDeliveryMail {
  get key() {
    return 'CancellationDeliveryMail';
  }

  async handle({ data }) {
    const { deliverer, product, recipient, description } = data;

    await Mail.sendMail({
      to: `${deliverer.name} <${deliverer.email}>`,
      subject: 'Entrega cancelada',
      template: 'CancelationDelivery',
      context: {
        description,
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

export default new CancellationDeliveryMail();
