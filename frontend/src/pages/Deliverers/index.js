import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { IconButton } from '~/components/Button';
import { NavigateButton } from '~/components/Button';
import { SearchInput } from '~/components/Form';
import HeaderList from '~/components/HeaderList';
import api from '~/services/api';
import history from '~/services/history';

import DelivererItem from './DelivererItem';
import { Container, Content, Grid, Button } from './styles';

export default function Deliverers() {
  const [deliverers, setDeliverers] = useState([]);
  const [page, setPage] = useState(1);

  async function loadDeliverers() {
    const response = await api.get('/deliverers', {
      params: {
        page,
      },
    });

    setDeliverers(response.data);
  }

  useEffect(() => {
    loadDeliverers();
  }, [page]); //eslint-disable-line

  async function handleSearchDeliverer(e) {
    setPage(1);

    const response = await api.get('/deliverers', {
      params: {
        q: e.target.value,
        page,
      },
    });

    setDeliverers(response.data);
  }

  return (
    <Container>
      <Content>
        <HeaderList title="Gerenciando entregadores">
          <SearchInput
            onChange={handleSearchDeliverer}
            type="text"
            placeholder="Buscar por entregadores"
          />
          <IconButton
            Icon={MdAdd}
            title="CADASTRAR"
            action={() => history.push('/deliverers/form')}
            type="button"
          />
        </HeaderList>

        <Grid>
          <section>
            <strong>ID</strong>
            <strong>Foto</strong>
            <strong>Nome</strong>
            <strong>Email</strong>
            <strong>Ações</strong>
          </section>
          {deliverers.map(deliverer => (
            <DelivererItem
              key={deliverer.id}
              data={deliverer}
              updateDeliverers={loadDeliverers}
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
            disabled={deliverers.length < 5}
            title="proximo"
            action={() => setPage(page + 1)}
            type="button"
          />
        </section>
      </Content>
    </Container>
  );
}
