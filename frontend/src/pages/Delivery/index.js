import React, { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';

import { parseISO, format } from 'date-fns';

import { IconButton } from '~/components/Button';
import { NavigateButton } from '~/components/Button';
import { SearchInput } from '~/components/Form';
import HeaderList from '~/components/HeaderList';
import api from '~/services/api';
import history from '~/services/history';

import DeliveryItem from './DeliveryItem';
import { Container, Content, Grid } from './styles';

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [page, setPage] = useState(1);

  function formatDates(data) {
    return data.map(delivery => ({
      ...delivery,
      start_dateFormated: delivery.start_date
        ? format(parseISO(delivery.start_date), 'dd/MM/yyyy')
        : null,
      end_dateFormated: delivery.end_date
        ? format(parseISO(delivery.end_date), 'dd/MM/yyyy')
        : null,
    }));
  }

  async function handleSearchCode(e) {
    setPage(1);
    const response = await api.get('/deliveries', {
      params: {
        code: e.target.value,
        page,
      },
    });

    const data = formatDates(response.data);

    setDeliveries(data);
  }

  async function handleSearchDelivery(e) {
    setPage(1);
    const response = await api.get('/deliveries', {
      params: {
        q: e.target.value,
        page,
      },
    });

    const data = formatDates(response.data);

    setDeliveries(data);
  }

  async function loadDeliveries() {
    const response = await api.get('/deliveries', {
      params: {
        page,
      },
    });

    const data = formatDates(response.data);

    setDeliveries(data);
  }

  useEffect(() => {
    loadDeliveries();
  }, [page]); //eslint-disable-line

  return (
    <Container>
      <Content>
        <HeaderList title="Gerenciando pedidos">
          <section>
            <SearchInput
              onChange={handleSearchCode}
              type="text"
              placeholder="Buscar por código"
            />
            <SearchInput
              onChange={handleSearchDelivery}
              type="text"
              placeholder="Buscar por nome/celular"
            />
          </section>
          <IconButton
            Icon={MdAdd}
            title="CADASTRAR"
            action={() => history.push('/pedidos/form')}
            type="button"
          />
        </HeaderList>

        <Grid>
          <section>
            <strong>ID</strong>
            <strong>Cliente</strong>
            <strong>Entregador</strong>
            <strong>Valor</strong>
            <strong>Endereço</strong>
            <strong>Status</strong>
            <strong>Ações</strong>
          </section>
          {deliveries.map(delivery => (
            <DeliveryItem
              updateDeliveries={loadDeliveries}
              key={delivery.id}
              data={delivery}
            />
          ))}
        </Grid>
        <section>
          <NavigateButton
            disabled={page === 1}
            title="voltar"
            action={() => setPage(page - 1)}
            type="button"
          />
          <NavigateButton
            disabled={deliveries.length < 5}
            title="proximo"
            action={() => setPage(page + 1)}
            type="button"
          />
        </section>
      </Content>
    </Container>
  );
}
