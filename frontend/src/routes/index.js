import React from 'react';
import { Switch } from 'react-router-dom';

import Delivery from '~/pages/Delivery';
import DeliveryForm from '~/pages/Delivery/Form';
import Deliverers from '~/pages/Deliverers';
import DeliverersForm from '~/pages/Deliverers/Form';
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

      <Route path="/deliveries" exact component={Delivery} isPrivate />
      <Route path="/deliveries/form" exact component={DeliveryForm} isPrivate />
      <Route
        path="/deliveries/form/:id"
        exact
        component={DeliveryForm}
        isPrivate
      />

      <Route path="/deliverers" exact component={Deliverers} isPrivate />
      <Route
        path="/deliverers/form"
        exact
        component={DeliverersForm}
        isPrivate
      />
      <Route
        path="/deliverers/form/:id"
        exact
        component={DeliverersForm}
        isPrivate
      />

      <Route path="/recipients" exact component={Recipients} isPrivate />
      <Route
        path="/recipients/form"
        exact
        component={RecipientsForm}
        isPrivate
      />
      <Route
        path="/recipients/form/:id"
        exact
        component={RecipientsForm}
        isPrivate
      />

      <Route path="/problems" component={Problems} isPrivate />
      <Route component={Error404} isPrivate />
    </Switch>
  );
}
