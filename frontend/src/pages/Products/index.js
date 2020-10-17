import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { IconButton } from '~/components/Button';
import { NavigateButton } from '~/components/Button';
import { SearchInput } from '~/components/Form';
import HeaderList from '~/components/HeaderList';
import api from '~/services/api';
import history from '~/services/history';

import ProductItem from './ProductItem';
import { Container, Content, Grid } from './styles';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  async function loadProducts() {
    const response = await api.get('/products', {
      params: {
        page,
      },
    });

    setProducts(response.data);
  }

  useEffect(() => {
    loadProducts();
  }, [page]); //eslint-disable-line

  async function handleSearchCode(e) {
    setPage(1);
    const response = await api.get('/products', {
      params: {
        code: e.target.value,
        page,
      },
    });

    setProducts(response.data);
  }

  async function handleSearchProduct(e) {
    setPage(1);

    const response = await api.get('/products', {
      params: {
        q: e.target.value,
        page,
      },
    });

    setProducts(response.data);
  }

  return (
    <Container>
      <Content>
        <HeaderList title="Gerenciando produtos">
          <section>
            <SearchInput
              onChange={handleSearchCode}
              type="text"
              placeholder="Buscar por código"
            />
            <SearchInput
              onChange={handleSearchProduct}
              type="text"
              placeholder="Buscar por nome"
            />
          </section>
          <IconButton
            Icon={MdAdd}
            title="CADASTRAR"
            action={() => history.push('/produtos/form')}
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
          {products.length > 0 &&
            products?.map(product => (
              <ProductItem
                key={product.id}
                data={product}
                updateProducts={loadProducts}
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
