import React from 'react';
import { Switch } from 'react-router-dom';

import Stocks from '~/pages/Stocks';
import StocksForm from '~/pages/Stocks/Form';
import Delivery from '~/pages/Delivery';
import DeliveryForm from '~/pages/Delivery/Form';
import Deliverers from '~/pages/Deliverers';
import DeliverersForm from '~/pages/Deliverers/Form';
import Products from '~/pages/Products';
import ProductsForm from '~/pages/Products/Form';
import Problems from '~/pages/Problems';
import Recipients from '~/pages/Recipients';
import RecipientsForm from '~/pages/Recipients/Form';
import SingIn from '~/pages/SingIn';

import Error404 from '~/pages/404';

import Route from './Route';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SingIn} />

      <Route path="/estoque" exact component={Stocks} isPrivate />
      <Route path="/estoque/form" exact component={StocksForm} isPrivate />
      <Route path="/estoque/form/:id" exact component={StocksForm} isPrivate />

      <Route path="/pedidos" exact component={Delivery} isPrivate />
      <Route path="/pedidos/form" exact component={DeliveryForm} isPrivate />
      <Route
        path="/pedidos/form/:id"
        exact
        component={DeliveryForm}
        isPrivate
      />

      <Route path="/entregadores" exact component={Deliverers} isPrivate />
      <Route
        path="/entregadores/form"
        exact
        component={DeliverersForm}
        isPrivate
      />
      <Route
        path="/entregadores/form/:id"
        exact
        component={DeliverersForm}
        isPrivate
      />

      <Route path="/produtos" exact component={Products} isPrivate />
      <Route path="/produtos/form" exact component={ProductsForm} isPrivate />
      <Route
        path="/produtos/form/:id"
        exact
        component={ProductsForm}
        isPrivate
      />

      <Route path="/clientes" exact component={Recipients} isPrivate />
      <Route path="/clientes/form" exact component={RecipientsForm} isPrivate />
      <Route
        path="/clientes/form/:id"
        exact
        component={RecipientsForm}
        isPrivate
      />

      <Route path="/problems" component={Problems} isPrivate />
      <Route component={Error404} isPrivate />
    </Switch>
  );
}
