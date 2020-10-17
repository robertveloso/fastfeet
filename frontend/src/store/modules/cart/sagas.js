import { call, select, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';
import history from '../../../services/history';

// import { formatPrice } from '../../../util/format';
// priceFormatted: formatPrice(response.data.price),

import {
  addToCartRequest,
  addToCartSuccess,
  clearCart,
  addToOrder,
  initCartSuccess,
} from './actions';

import { store } from '../../index';

function* initCart({ uuid }) {
  yield put(clearCart());
  const response = yield call(api.get, `deliveries/${uuid}`);

  const data = {
    uuid: response.data.id,
    orders: [],
  };
  response.data.deliveriesProducts.forEach(product => {
    data.orders.push({
      uuid: product.order_id,
      id: product.product_id,
      name: product.products[0].name,
      price: product.products[0].price,
      stock: [],
    });
  });

  response.data.deliveriesStock.forEach(stock => {
    data.orders.forEach(order => {
      if (stock.order_id === order.uuid) {
        order.stock.push({
          id: stock.stock_id,
          name: stock.stock[0].name,
          price: stock.stock[0].price,
          quantity: stock.quantity,
        });
      }
    });
  });

  yield put(initCartSuccess(data));
}

function* addToCart({ uuid, product, stock }) {
  const { signed } = store.getState().auth;

  if (!signed) {
    yield put(clearCart());
    history.push('/');
    return;
  }

  const data = {
    uuid,
    orders: [
      {
        uuid: product.uuidOrder,
        id: product.id,
        name: product.name,
        price: product.price,
        stock: [
          {
            id: stock?.id,
            name: stock?.name,
            price: stock?.price,
            quantity: 1,
          },
        ],
      },
    ],
  };
  yield put(addToCartSuccess(data));
}

function* updateQuantity({ uuid, product, stock, operator }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.uuid === uuid)
  );
  if (productExists) {
    const orderExists = yield select(state =>
      state.cart.find(p => p.uuid === uuid)
    );

    if (orderExists) {
      const data = {
        uuid: product.uuidOrder,
        id: product.id,
        name: product.name,
        price: product.price,
        stock: [
          {
            id: stock.id,
            name: stock.name,
            price: stock.price,
            quantity: 1,
          },
        ],
      };
      yield put(addToOrder(uuid, data, operator));
    }
  } else {
    yield put(addToCartRequest(uuid, product, stock));
  }
}

export default all([
  takeLatest('@cart/INIT_REQUEST', initCart),
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_QUANTITY_REQUEST', updateQuantity),
]);
