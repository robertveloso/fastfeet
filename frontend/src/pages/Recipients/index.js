import React, { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';

import { IconButton } from '~/components/Button';
import { NavigateButton } from '~/components/Button';
import { SearchInput } from '~/components/Form';
import HeaderList from '~/components/HeaderList';
import api from '~/services/api';
import history from '~/services/history';

import RecipientItem from './RecipientItem';
import { Container, Content, Grid } from './styles';

export default function Recipients() {
  const [page, setPage] = useState(1);
  const [recipients, setRecipients] = useState([]);

  async function loadRecipients() {
    const response = await api.get('/recipients', {
      params: {
        page,
      },
    });

    setRecipients(response.data);
  }

  useEffect(() => {
    loadRecipients();
  }, [page]); // eslint-disable-line

  async function handleSearchCode(e) {
    setPage(1);
    const response = await api.get('/recipients', {
      params: {
        code: e.target.value,
        page,
      },
    });

    setRecipients(response.data);
  }

  async function handleSearchRecipient(e) {
    setPage(1);

    const response = await api.get('/recipients', {
      params: {
        q: e.target.value,
        page,
      },
    });

    setRecipients(response.data);
  }

  return (
    <Container>
      <Content>
        <HeaderList title="Gerenciando destinatários">
          <section>
            <SearchInput
              onChange={handleSearchCode}
              type="text"
              placeholder="Buscar por código"
            />
            <SearchInput
              onChange={handleSearchRecipient}
              type="text"
              placeholder="Buscar por nome/celular"
            />
          </section>
          <IconButton
            Icon={MdAdd}
            title="CADASTRAR"
            action={() => history.push('/clientes/form')}
            type="button"
          />
        </HeaderList>
        <Grid>
          <section>
            <strong>ID</strong>
            <strong>Celular/Nome</strong>
            <strong>Endereço</strong>
            <strong>Ações</strong>
          </section>
          {recipients.map(recipient => (
            <RecipientItem
              updateRecipients={loadRecipients}
              key={recipient.id}
              data={recipient}
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
            disabled={recipients.length < 5}
            title="proximo"
            action={() => setPage(page + 1)}
            type="button"
          />
        </section>
      </Content>
    </Container>
  );
}
