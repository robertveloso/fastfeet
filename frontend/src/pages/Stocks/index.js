import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { IconButton } from '~/components/Button';
import { NavigateButton } from '~/components/Button';
import { SearchInput } from '~/components/Form';
import HeaderList from '~/components/HeaderList';
import api from '~/services/api';
import history from '~/services/history';

import StockItem from './StockItem';
import { Container, Content, Grid } from './styles';

export default function Stocks() {
  const [products, setStocks] = useState([]);
  const [page, setPage] = useState(1);

  async function loadStocks() {
    const response = await api.get('/stock', {
      params: {
        page,
      },
    });

    setStocks(response.data);
  }

  useEffect(() => {
    loadStocks();
  }, [page]); //eslint-disable-line

  async function handleSearchCode(e) {
    setPage(1);
    const response = await api.get('/stock', {
      params: {
        code: e.target.value,
        page,
      },
    });

    setStocks(response.data);
  }

  async function handleSearchStock(e) {
    setPage(1);

    const response = await api.get('/stock', {
      params: {
        q: e.target.value,
        page,
      },
    });

    setStocks(response.data);
  }

  return (
    <Container>
      <Content>
        <HeaderList title="Gerenciando estoque">
          <section>
            <SearchInput
              onChange={handleSearchCode}
              type="text"
              placeholder="Buscar por código"
            />
            <SearchInput
              onChange={handleSearchStock}
              type="text"
              placeholder="Buscar por nome"
            />
          </section>
          <IconButton
            Icon={MdAdd}
            title="CADASTRAR"
            action={() => history.push('/estoque/form')}
            type="button"
          />
        </HeaderList>

        <Grid>
          <section>
            <strong>ID</strong>
            <strong>Foto</strong>
            <strong>Nome</strong>
            <strong>Valor</strong>
            <strong>Ações</strong>
          </section>
          {products.map(product => (
            <StockItem
              key={product.id}
              data={product}
              updateStocks={loadStocks}
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
            disabled={products.length < 5}
            title="proximo"
            action={() => setPage(page + 1)}
            type="button"
          />
        </section>
      </Content>
    </Container>
  );
}
