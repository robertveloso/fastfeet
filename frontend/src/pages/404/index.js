import React from 'react';

import history from '~/services/history';

import { Container } from './styles';

import img404 from '~/assets/404.png';

export default function Error() {
  return (
    <Container>
      <img src={img404} alt="Error 404" />
      <h1>Você está perdido.</h1>
      <h2>
        Volte para{' '}
        <a href="#" onClick={() => history.goBack()}>
          casa
        </a>
      </h2>
    </Container>
  );
}
