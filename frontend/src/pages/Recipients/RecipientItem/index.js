import React from 'react';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';

import More from '~/components/MorePopUp';
import api from '~/services/api';
import history from '~/services/history';
import { colors } from '~/styles/colors';

import { Container, MoreConainer } from './styles';

export default function RecipientItem({ data, updateRecipients }) {
  async function handleDelete() {
    const confirm = window.confirm('Você tem certeza que deseja deletar isso?');

    if (!confirm) {
      toast.error('Cliente não apagado!');
      return;
    }

    try {
      await api.delete(`/recipients/${data.id}`);
      updateRecipients();
      toast.success('Cliente apagado com sucesso!');
    } catch (err) {
      toast.error(
        'Esse cliente não pode ser apagado, pois ainda tem entrega pendente!'
      );
    }
  }

  return (
    <Container>
      <small>#{data.code}</small>
      <small>{data.name ? `${data.phone} - ${data.name}` : data.phone}</small>
      <small>
        {data.street}, {data.number} - {data.district}
      </small>
      <More>
        <MoreConainer>
          <div>
            <button
              onClick={() => history.push(`/clientes/form/${data.id}`)}
              type="button"
            >
              <MdEdit color={colors.info} size={15} />
              <span>Editar</span>
            </button>
          </div>
          <div>
            <button onClick={handleDelete} type="button">
              <MdDeleteForever color={colors.danger} size={15} />
              <span>Excluir</span>
            </button>
          </div>
        </MoreConainer>
      </More>
    </Container>
  );
}

RecipientItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    phone: PropTypes.string.isRequired,
    street: PropTypes.string,
    number: PropTypes.number,
  }).isRequired,
  updateRecipients: PropTypes.func.isRequired,
};
