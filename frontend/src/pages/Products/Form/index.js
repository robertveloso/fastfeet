import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { SaveButton, BackButton } from '~/components/Button';
import {
  CurrencyInput,
  SimpleInput,
  TextAreaInput,
  PhotoInput,
  AsyncSelectInput,
  CheckBoxInput,
} from '~/components/Form';
import HeaderForm from '~/components/HeaderForm';
import api from '~/services/api';
import history from '~/services/history';
import { formatPriceSave, formatPriceDisplay } from '~/utils/format';

import { Container, Content, UnForm } from './styles';

export default function ProductForm({ match }) {
  const { id } = match.params;
  const formRef = useRef(null);
  const [price, setPrice] = useState();

  const customStylesSelectInput = {
    control: provided => ({
      ...provided,
      height: 45,
    }),
  };

  useEffect(() => {
    async function loadInitialData(productId) {
      if (id) {
        const response = await api.get(`/products/${productId}`);

        setPrice(formatPriceDisplay(response.data.price));

        formRef.current.setData(response.data);

        const array = [];

        response.data.stock.forEach(el => {
          array.push({
            value: el.id,
            label: el.name,
          });
        });
        formRef.current.setFieldValue('components', array);
        formRef.current.setFieldValue('avatar', response?.data?.avatar?.url);
      }
    }
    loadInitialData(id);
  }, [id]);

  const [productsDefaultValue, setProductsDefaultValue] = useState();
  useEffect(() => {
    async function productsOptions() {
      const response = await api.get('/stock');
      const data = response.data.map(product => ({
        value: product.id,
        label: product.name,
      }));
      setProductsDefaultValue(data);
    }
    productsOptions();
  }, []);

  async function loadProductsOptions(inputValue, callback) {
    const response = await api.get('/stock', {
      params: {
        q: inputValue,
      },
    });
    const data = response.data.map(product => ({
      value: product.id,
      label: product.name,
    }));
    callback(data);
  }

  async function handleSubmit(data, { reset }) {
    console.log(data.price);
    data.price = formatPriceSave(data.price);

    formRef.current.setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        price: Yup.string().required('O valor é obrigatório'),
        components: Yup.array().required('Os ingredientes são obrigatórios'),
        type: Yup.boolean().required('O tipo é obrigatório'),
        description: Yup.string().optional(),
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
        await api.put(`/products/${id}`, {
          name: data.name,
          price: data.price,
          components: data.components,
          type: data.type,
          description: data.description,
          avatar_id: responseFile?.data?.id,
        });
        toast.success('Produto editado com sucesso!');
        history.push('/produtos');
      } else {
        await api.post('/products', {
          name: data.name,
          price: data.price,
          components: data.components,
          type: data.type,
          description: data.description,
          avatar_id: responseFile?.data?.id,
        });

        toast.success('Produto criado com sucesso!');
        history.push('/produtos');
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
        <HeaderForm title="Cadastro de produtos">
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

          <CheckBoxInput
            label="Faz parte do cardápio"
            name="type"
            option={{
              id: 'type',
              value: 'type',
              label: 'Faz parte do cardápio',
            }}
          />

          <section>
            <AsyncSelectInput
              type="text"
              label="Ingredientes"
              name="components"
              placeholder="Ingredientes"
              noOptionsMessage={() => 'Nenhum ingrediente encontrado'}
              defaultOptions={productsDefaultValue}
              loadOptions={loadProductsOptions}
              styles={customStylesSelectInput}
              isMulti
            />
          </section>
          <TextAreaInput
            label="Descrição"
            name="description"
            type="text"
            placeholder="Descrição do produto"
          />
          <CurrencyInput
            label="Preço"
            name="price"
            type="text"
            placeholder="R$ 10,00"
            value={price}
            onChange={(e, masked) => setPrice(`R$ ${masked}`)}
            onKeyPress={e =>
              e.key === 'Enter' ? formRef.current.submitForm() : null
            }
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
