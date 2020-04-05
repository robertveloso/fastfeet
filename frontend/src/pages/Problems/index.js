import React, { useState, useEffect } from 'react';

import HeaderList from '~/components/HeaderList';
import api from '~/services/api';
import { NavigateButton } from '~/components/Button';

import ProblemItem from './ProblemItem';
import { Container, Content, Grid } from './styles';

export default function Problems() {
  const [page, setPage] = useState(1);
  const [problems, setProblems] = useState([]);

  async function loadProblems() {
    const response = await api.get('/deliveries/problems', {
      params: {
        page,
      },
    });

    setProblems(response.data);
  }
  useEffect(() => {
    loadProblems();
  }, [page]); //eslint-disable-line

  return (
    <Container>
      <Content>
        <HeaderList title="Problemas na entrega" />
        <Grid>
          <section>
            <strong>Encomenda</strong>
            <strong>Problema</strong>
            <strong>Ações</strong>
          </section>
          {problems.map(problem => (
            <ProblemItem
              updateProblems={loadProblems}
              key={problem._id}
              data={problem}
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
            disabled={problems.length < 5}
            title="proximo"
            action={() => setPage(page + 1)}
            type="button"
          />
        </section>
      </Content>
    </Container>
  );
}
