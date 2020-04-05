import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { SaveButton, BackButton } from '~/components/Button';
import { AsyncSelectInput, SimpleInput } from '~/components/Form';
import HeaderForm from '~/components/HeaderForm';
import api from '~/services/api';
import history from '~/services/history';

import { Container, Content, UnForm } from './styles';

export default function DeliveryForm({ match }) {
  const { id } = match.params;
  const formRef = useRef(null);

  useEffect(() => {
    async function loadInitialData(deliveryId) {
      if (id) {
        const response = await api.get(`/deliveries/${deliveryId}`);

        formRef.current.setData(response.data);
        formRef.current.setFieldValue('recipient_id', {
          value: response.data.recipient.id,
          label: response.data.recipient.name,
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

  async function loadRecipientOptions(inputValue, callback) {
    const response = await api.get('/recipients', {
      params: {
        q: inputValue,
      },
    });

    const data = response.data.map(recipient => ({
      value: recipient.id,
      label: recipient.name,
    }));

    return data;
  }
  const [deliverersDefaultValue, setDeliverersDefaultValue] = useState();
  const [recipientDefaultValue, setRecipientDefaultValue] = useState();

  useEffect(() => {
    async function recipientOptions() {
      const response = await api.get('/recipients');
      const data = response.data.map(recipient => ({
        value: recipient.id,
        label: recipient.name,
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
  }, []);

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
    formRef.current.setErrors({});
    try {
      const schema = Yup.object().shape({
        product: Yup.string().required('O nome do produto é obrigatório'),
        recipient_id: Yup.string().required('O destinatário é obrigatório'),
        deliverer_id: Yup.string().required('O entregador é obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (id) {
        await api.put(`/deliveries/${id}`, {
          product: data.product,
          recipient_id: data.recipient_id,
          deliverer_id: data.deliverer_id,
        });
        history.push('/deliveries');
        toast.success('Encomenda editada com sucesso!');
      } else {
        const response = await api.post('/deliveries', {
          product: data.product,
          recipient_id: data.recipient_id,
          deliverer_id: data.deliverer_id,
        });
        console.log(12, response);
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
        <HeaderForm title="Cadastro de encomendas">
          <BackButton />
          <SaveButton action={() => formRef.current.submitForm()} />
        </HeaderForm>

        <UnForm ref={formRef} onSubmit={handleSubmit}>
          <section>
            <AsyncSelectInput
              type="text"
              label="Destinatário"
              name="recipient_id"
              placeholder="Destinatários"
              noOptionsMessage={() => 'Nenhum destinatário encontrado'}
              defaultOptions={recipientDefaultValue}
              loadOptions={loadRecipientOptions}
              styles={customStylesSelectInput}
            />
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
          <SimpleInput
            label="Nome do produto"
            name="product"
            type="text"
            placeholder="Nome do produto"
            onKeyPress={e =>
              e.key === 'Enter' ? formRef.current.submitForm() : null
            }
          />
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
