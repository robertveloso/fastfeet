import React from 'react';
import {
  MdStore,
  MdTimer,
  MdArchive,
  MdCancel,
  MdEdit,
  MdDeleteForever,
} from 'react-icons/md';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';

import More from '~/components/MorePopUp';
import api from '~/services/api';
import history from '~/services/history';
import { statusColors, colors } from '~/styles/colors';
import { formatPriceDisplay } from '~/utils/format';
// import getError from '~/utils/error';

import DeliveryModal from '../Modal';
import Status from './DeliveryStatus';
import { Container, MoreConainer } from './styles';

export default function DeliveryItem({ data, updateDeliveries }) {
  async function handleDelete() {
    const confirm = window.confirm('Você tem certeza que deseja deletar isso?');

    if (!confirm) {
      toast.error('Pedido não apagado!');
      return;
    }

    try {
      await api
        .delete(`/deliveries/${data.id}`)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err.response);
          throw Error(err.response.data.code);
        });
      updateDeliveries();
      toast.success('Pedido apagado com sucesso!');
    } catch (err) {
      toast.error('Altere o status do produto primeiro.');
      // toast.error(getError(err.message));
    }
  }
  async function handleStatus(status) {
    const confirm = window.confirm(
      'Você tem certeza que deseja alterar o status?'
    );

    if (!confirm) {
      toast.error('Status não alterado!');
      return;
    }
    try {
      await api
        .put(`/deliveries/status/${data.id}`, {
          status,
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err.response);
          throw Error(err);
        });
      updateDeliveries();
      toast.success('Status alterado com sucesso!');
    } catch (err) {
      toast.error('Status não pode ser alterado!');
      // toast.error(getError(err.message));
    }
  }

  return (
    <Container>
      <small>#{String(data.code).padStart(7, '0')}</small>
      <small>
        {data?.recipient?.name ? data?.recipient?.name : data?.recipient?.phone}
      </small>
      <small>{data.deliverer.name}</small>
      <small>{formatPriceDisplay(data?.total)}</small>

      <small>
        {data?.recipient?.street
          ? `${data?.recipient?.street}, ${data?.recipient?.number}`
          : 'não cadastrado'}
      </small>
      <Status
        text={data?.status}
        color={statusColors[data?.status].color}
        background={statusColors[data?.status].background}
      />
      <More>
        <MoreConainer>
          <div>
            <DeliveryModal data={data} />
          </div>

          <div>
            <button
              onClick={() => history.push(`/pedidos/form/${data.id}`)}
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
          <div>
            <button onClick={() => handleStatus('ENTREGUE')} type="button">
              <MdArchive color={statusColors['ENTREGUE'].color} size={15} />
              <span>Entregue</span>
            </button>
          </div>
          <div>
            <button onClick={() => handleStatus('PENDENTE')} type="button">
              <MdTimer color={statusColors['PENDENTE'].color} size={15} />
              <span>Pendente</span>
            </button>
          </div>
          <div>
            <button onClick={() => handleStatus('RETIRADA')} type="button">
              <MdStore color={statusColors['RETIRADA'].color} size={15} />
              <span>Retirado</span>
            </button>
          </div>
          <div>
            <button onClick={() => handleStatus('CANCELADA')} type="button">
              <MdCancel color={statusColors['CANCELADA'].color} size={15} />
              <span>Cancelado</span>
            </button>
          </div>
        </MoreConainer>
      </More>
    </Container>
  );
}

DeliveryItem.propTypes = {
  updateDeliveries: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    product: PropTypes.string,
    recipient: PropTypes.shape({
      name: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
    }),
    status: PropTypes.string,
  }).isRequired,
};
