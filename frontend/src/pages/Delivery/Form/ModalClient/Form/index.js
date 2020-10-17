import React, { useEffect, useRef } from 'react';

import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { SaveButton, BackButton } from '~/components/Button';
import { SimpleInput, MaskInput, TextAreaInput } from '~/components/Form';
import HeaderForm from '~/components/HeaderForm';
import api from '~/services/api';

import { Container, Content, UnForm } from './styles';

export default function RecipientForm({ id, close }) {
  const formRef = useRef();

  useEffect(() => {
    async function loadInitialData() {
      if (id) {
        const response = await api.get(`/recipients/${id}`);

        formRef.current.setData(response.data);
      }
    }
    loadInitialData();
  }, [id]);

  async function handleSubmit(data, { reset }) {
    formRef.current.setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().notRequired(),
        phone: Yup.string().required('Celular é obrigatório'),
        mail: Yup.string()
          .email()
          .notRequired(),
        street: Yup.string().notRequired(),
        number: Yup.string().notRequired(),
        district: Yup.string().notRequired(),
        complement: Yup.string().notRequired(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      console.log(data);
      const phone = data.phone.replace(/[\s()-]+/gi, '');

      if (id) {
        await api.put(`/recipients/${id}`, {
          name: data?.name,
          phone: phone,
          mail: data?.mail,
          street: data?.street,
          number: data?.number,
          district: data?.district,
          complement: data?.complement,
        });
        toast.success('Cliente editado com sucesso!');
        close();
      } else {
        await api.post('/recipients', {
          name: data?.name,
          phone: phone,
          mail: data?.mail,
          street: data?.street,
          number: data?.number,
          district: data?.district,
          complement: data?.complement,
        });
        toast.success('Cliente criado com sucesso!');
        close();
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
        <HeaderForm title="Cadastro de cliente">
          <BackButton action={() => close()} text="CANCELAR" />
          <SaveButton action={() => formRef.current.submitForm()} />
        </HeaderForm>

        <UnForm ref={formRef} onSubmit={handleSubmit}>
          <div>
            <SimpleInput
              label="Nome"
              name="name"
              type="text"
              placeholder="Nome do cliente"
            />
            <MaskInput
              label="Celular"
              name="phone"
              type="text"
              mask="(99) 9 9999-9999"
              maskPlaceholder={null}
              placeholder="(__) _ ____-____"
            />
            <SimpleInput
              label="Email"
              name="mail"
              type="email"
              placeholder="E-mail do cliente"
            />
          </div>
          <div>
            <SimpleInput
              label="Rua"
              name="street"
              type="text"
              placeholder="Rua do cliente"
            />
            <SimpleInput
              label="Número"
              name="number"
              type="number"
              placeholder="Número da casa"
            />
            <SimpleInput
              label="Bairro"
              name="district"
              type="text"
              placeholder="Bairro do cliente"
              onKeyPress={e =>
                e.key === 'Enter' ? formRef.current.submitForm() : null
              }
            />
          </div>
          <div>
            <TextAreaInput label="Complemento" name="complement" type="text" />
          </div>
        </UnForm>
      </Content>
    </Container>
  );
}

RecipientForm.propTypes = {
  id: PropTypes.string,
  close: PropTypes.func.isRequired,
};
