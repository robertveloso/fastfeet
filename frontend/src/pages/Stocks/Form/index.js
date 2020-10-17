import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { SaveButton, BackButton } from '~/components/Button';
import {
  CurrencyInput,
  SimpleInput,
  PhotoInput,
  TextAreaInput,
} from '~/components/Form';
import HeaderForm from '~/components/HeaderForm';
import api from '~/services/api';
import history from '~/services/history';

import { formatPriceSave, formatPriceDisplay } from '~/utils/format';
// priceFormatted: formatPriceSave(response.data.price),

import { Container, Content, UnForm } from './styles';

export default function ProductForm({ match }) {
  const { id } = match.params;
  const formRef = useRef(null);
  const [price, setPrice] = useState();

  useEffect(() => {
    async function loadInitialData(stockId) {
      if (id) {
        const response = await api.get(`/stock/${stockId}`);

        setPrice(formatPriceDisplay(response.data.price));

        formRef.current.setData(response.data);
        formRef.current.setFieldValue('avatar', response?.data?.avatar?.url);
      }
    }
    loadInitialData(id);
  }, [id]);

  async function handleSubmit(data, { reset }) {
    data.price = formatPriceSave(data.price);

    formRef.current.setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        price: Yup.number().required('O valor é obrigatório'),
        quantity: Yup.string().required('A quantidade é obrigatória'),
        notes: Yup.string().optional(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const dataFile = new FormData();

      dataFile.append('file', data.avatar);

      const responseFile = data.avatar
        ? await api.post('files', dataFile)
        : null;

      if (id) {
        await api.put(`/stock/${id}`, {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          notes: data.notes,
          avatar_id: responseFile?.data?.id,
        });
        toast.success('Produto editado no estoque com sucesso!');
        history.push('/estoque');
      } else {
        await api.post('/stock', {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          notes: data.notes,
          avatar_id: responseFile?.data?.id,
        });
        toast.success('Produto adicionado ao estoque com sucesso!');
        history.push('/estoque');
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
        <HeaderForm title="Cadastro de estoque">
          <BackButton />
          <SaveButton action={() => formRef.current.submitForm()} />
        </HeaderForm>

        <UnForm ref={formRef} onSubmit={handleSubmit}>
          <PhotoInput name="avatar" />
          <SimpleInput
            label="Nome"
            name="name"
            type="text"
            placeholder="Nome do produto"
          />
          <CurrencyInput
            label="Preço"
            name="price"
            type="text"
            placeholder="R$ 10,00"
            value={price}
            onChange={(e, masked) => setPrice(`R$ ${masked}`)}
            // onKeyPress={e =>
            //   e.key === 'Enter' ? formRef.current.submitForm() : null
            // }
          />
          <SimpleInput
            label="Quantidade"
            name="quantity"
            type="text"
            placeholder="Quantidade do produto"
          />
          <TextAreaInput
            label="Notas"
            name="notes"
            type="text"
            placeholder=""
          />
        </UnForm>
      </Content>
    </Container>
  );
}

ProductForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
