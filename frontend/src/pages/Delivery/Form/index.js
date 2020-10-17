import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdAdd } from 'react-icons/md';
import { Portal } from 'react-portal';

import { useHotkeys } from 'react-hotkeys-hook';

import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { SaveButton, BackButton } from '~/components/Button';
import { AsyncSelectInput, CurrencyInput } from '~/components/Form';
import HeaderForm from '~/components/HeaderForm';
import api from '~/services/api';
import history from '~/services/history';

import { formatPriceSave, formatPriceDisplay } from '~/utils/format';
import { initCart } from '~/store/modules/cart/actions';

import ModalProducts from './Modal';
import ModalClient from './ModalClient';

import { Container, Content, UnForm, ModalButton } from './styles';

export default function DeliveryForm({ match }) {
  useHotkeys('alt+1', () => history.goBack());
  useHotkeys('alt+2', () => formRef.current.submitForm());
  const { id } = match.params;
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const formRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [fare, setFare] = useState();
  const [discount, setDiscount] = useState();
  const [received, setReceived] = useState();
  const [change, setChange] = useState();
  const [subTotal, setSubTotal] = useState();
  const [total, setTotal] = useState();

  const [paymentMethod, setPaymentMethod] = useState(null);

  const [arrProducts, setArrProducts] = useState([]);
  const [arrStock, setArrStock] = useState([]);

  useEffect(() => {
    id && dispatch(initCart(id));
    return;
  }, [dispatch, id]);

  useEffect(() => {
    setTotal(0);
    setSubTotal(0);
    function calculateTotal() {
      arrProducts.length > 0 &&
        arrProducts.forEach(a => {
          setTotal(total => total + formatPriceSave(a.price));
          setSubTotal(subTotal => subTotal + formatPriceSave(a.price));
        });

      arrStock.length > 0 &&
        arrStock.forEach(a => {
          setTotal(total => total + formatPriceSave(a.price) * a.quantity);
          setSubTotal(
            subTotal => subTotal + formatPriceSave(a.price) * a.quantity
          );
        });

      setTotal(total =>
        formatPriceDisplay(
          total / 100 + formatPriceSave(fare) - formatPriceSave(discount)
        )
      );

      setChange(
        formatPriceDisplay(formatPriceSave(received) - formatPriceSave(total))
      );
    }
    calculateTotal();
  }, [total, discount, fare, received, arrProducts, arrStock]);

  useEffect(() => {
    setArrProducts([]);
    setArrStock([]);
    function makeOrderList(cart) {
      cart.orders.forEach(order => {
        setArrProducts(arrProducts => [
          ...arrProducts,
          { id: order.id, uuid: order.uuid, price: order.price },
        ]);
        order.stock &&
          order.stock.forEach(s => {
            setArrStock(arrStock => [
              ...arrStock,
              {
                id: s.id,
                productId: order.id,
                orderUUID: order.uuid,
                quantity: s.quantity,
                price: s.price,
              },
            ]);
          });
      });
    }

    cart[0] && makeOrderList(cart[0]);
  }, [cart]);

  const payment_methods = [
    { value: 0, label: 'Cartão' },
    { value: 1, label: 'Dinheiro' },
  ];

  useEffect(() => {
    async function loadInitialData(deliveryId) {
      if (id) {
        const response = await api.get(`/deliveries/${deliveryId}`);
        setFare(formatPriceDisplay(response.data.fare));
        setDiscount(formatPriceDisplay(response.data.discount));
        setReceived(formatPriceDisplay(response.data.received));
        setChange(formatPriceDisplay(response.data.change));

        formRef.current.setData(response.data);

        formRef.current.setFieldValue(
          'payment_method',
          payment_methods.find(p => p.value === response.data.payment_method)
        );
        formRef.current.setFieldValue('recipient_id', {
          value: response.data.recipient.id,
          label: response.data.recipient.name
            ? response.data.recipient.name
            : response.data.recipient.phone,
        });
        formRef.current.setFieldValue('deliverer_id', {
          value: response.data.deliverer.id,
          label: response.data.deliverer.name,
        });
      }
    }

    loadInitialData(id);
  }, [id]);

  const customStylesSelectInput = {
    control: provided => ({
      ...provided,
      height: 45,
    }),
  };

  const [deliverersDefaultValue, setDeliverersDefaultValue] = useState();
  const [recipientDefaultValue, setRecipientDefaultValue] = useState();

  useEffect(() => {
    async function recipientOptions() {
      const response = await api.get('/recipients');
      const data = response.data.map(recipient => ({
        value: recipient.id,
        label: recipient.name ? recipient.name : recipient.phone,
      }));
      setRecipientDefaultValue(data);
    }
    async function deliverersOptions() {
      const response = await api.get('/deliverers');
      const data = response.data.map(deliverer => ({
        value: deliverer.id,
        label: deliverer.name,
      }));
      setDeliverersDefaultValue(data);
    }

    recipientOptions();
    deliverersOptions();
  }, [open]);

  async function loadRecipientOptions(inputValue, callback) {
    const response = await api.get('/recipients', {
      params: {
        q: inputValue,
      },
    });

    const data = response.data.map(recipient => ({
      value: recipient.id,
      label: recipient.name ? recipient.name : recipient.phone,
    }));

    return data;
  }

  async function loadDeliverersOptions(inputValue, callback) {
    const response = await api.get('/deliverers', {
      params: {
        q: inputValue,
      },
    });
    const data = response.data.map(deliverer => ({
      value: deliverer.id,
      label: deliverer.name,
    }));
    callback(data);
  }

  async function handleSubmit(data, { reset }) {
    data.fare = formatPriceSave(data.fare);
    data.discount = formatPriceSave(data.discount);
    data.received = formatPriceSave(data.received);
    data.change = formatPriceSave(data.change);
    data.total = formatPriceSave(data.total);

    formRef.current.setErrors({});
    try {
      const schema = Yup.object().shape({
        payment_method: Yup.number()
          .integer()
          .notRequired(),
        fare: Yup.number().notRequired(),
        discount: Yup.number().notRequired(),
        received: Yup.number().notRequired(),
        change: Yup.number().notRequired(),
        total: Yup.number().notRequired(),
        recipient_id: Yup.string().required('O destinatário é obrigatório'),
        deliverer_id: Yup.string().required('O entregador é obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      if (id) {
        await api.put(`/deliveries/${id}`, {
          payment_method: data.payment_method,
          fare: data.fare,
          discount: data.discount,
          received: data.received,
          change: data.change,
          total: data.total,
          products: arrProducts,
          stock: arrStock,
          recipient_id: data.recipient_id,
          deliverer_id: data.deliverer_id,
        });
        history.push('/pedidos');
        toast.success('Encomenda editada com sucesso!');
      } else {
        const response = await api.post('/deliveries', {
          recipient_id: data.recipient_id,
          deliverer_id: data.deliverer_id,
        });
        history.push('/pedidos/form/' + response.data.id);
        toast.success('Encomenda criada com sucesso!');
      }

      reset();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        });

        formRef.current.setErrors(errorMessages);
      }
    }
  }

  return (
    <Container>
      <Content>
        <HeaderForm title="Cadastro de pedido">
          <BackButton />
          <SaveButton action={() => formRef.current.submitForm()} />
        </HeaderForm>

        <UnForm ref={formRef} onSubmit={handleSubmit}>
          <section>
            <AsyncSelectInput
              type="text"
              label="Cliente"
              name="recipient_id"
              placeholder="Cliente"
              noOptionsMessage={() => 'Nenhum cliente encontrado'}
              defaultOptions={recipientDefaultValue}
              loadOptions={loadRecipientOptions}
              styles={{
                control: provided => ({
                  ...provided,
                  height: 45,
                  borderRadius: '4px 0 0 4px',
                }),
              }}
            />
            <ModalClient setOpen={setOpen} open={open} />
            <ModalButton>
              <MdAdd size={24} onClick={() => setOpen(true)} />
            </ModalButton>

            <AsyncSelectInput
              type="text"
              label="Entregador"
              name="deliverer_id"
              placeholder="Entregadores"
              noOptionsMessage={() => 'Nenhum entregador encontrado'}
              defaultOptions={deliverersDefaultValue}
              loadOptions={loadDeliverersOptions}
              styles={customStylesSelectInput}
            />
          </section>

          {id ? (
            <>
              {/* <section style={{ justifyContent: 'flex-start' }}>
                <Portal><ModalProducts uuid={id} /></Portal>
                <strong>
                  SubTotal: {formatPriceDisplay(subTotal / 100)}
                </strong>
              </section> */}
              <section>
                <AsyncSelectInput
                  type="text"
                  label="Forma de Pagamento"
                  name="payment_method"
                  placeholder="Forma de Pagamento"
                  noOptionsMessage={() =>
                    'Nenhuma método de pagamento encontrado'
                  }
                  onChange={item => setPaymentMethod(item?.value)}
                  defaultOptions={payment_methods}
                  styles={customStylesSelectInput}
                />

                <CurrencyInput
                  type="text"
                  name="fare"
                  label="Valor do Frete"
                  value={fare}
                  onChange={(e, masked) => setFare(`R$ ${masked}`)}
                />
                <CurrencyInput
                  type="text"
                  name="discount"
                  label="Valor do Desconto"
                  value={discount}
                  onChange={(e, masked) => setDiscount(`R$ ${masked}`)}
                />
              </section>
              <section>
                {paymentMethod === 1 && (
                  <>
                    <CurrencyInput
                      type="text"
                      name="received"
                      label="Valor Recebido"
                      value={received}
                      onChange={(e, masked) => setReceived(`R$ ${masked}`)}
                    />
                    <CurrencyInput
                      type="text"
                      name="change"
                      label="Valor do Troco"
                      value={change}
                      // onChange={(e, masked) => setReceived(`R$ ${masked}`)}
                      // value={change < 0 ? 0 : String(change).replace('.', ',')}
                    />
                  </>
                )}
                <CurrencyInput
                  type="text"
                  name="total"
                  label="Valor Total"
                  value={total}
                />
              </section>
              <section>
                <strong>
                  Total dos produtos: {formatPriceDisplay(subTotal / 100)}
                </strong>
                <Portal>
                  <ModalProducts uuid={id} />
                </Portal>
              </section>
            </>
          ) : (
            <strong>Ao salvar os outros campos estarão disponíveis</strong>
          )}
        </UnForm>
      </Content>
    </Container>
  );
}

DeliveryForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
