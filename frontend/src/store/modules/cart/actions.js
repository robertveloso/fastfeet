export function initCart(uuid) {
  return {
    type: '@cart/INIT_REQUEST',
    uuid,
  };
}
export function initCartSuccess(data) {
  return {
    type: '@cart/INIT_SUCCESS',
    data,
  };
}

export function clearCart() {
  return {
    type: '@cart/CLEAR',
  };
}

export function updateQuantityRequest(uuid, product, stock, operator) {
  return {
    type: '@cart/UPDATE_QUANTITY_REQUEST',
    uuid,
    product,
    stock,
    operator,
  };
}

export function updateQuantitySuccess(uuid, product, stock, operator) {
  return {
    type: '@cart/UPDATE_QUANTITY_SUCCESS',
    uuid,
    product,
    stock,
    operator,
  };
}

export function addToCartRequest(uuid, product, stock) {
  return {
    type: '@cart/ADD_REQUEST',
    uuid,
    product,
    stock,
  };
}

export function addToCartSuccess(product) {
  return {
    type: '@cart/ADD_SUCCESS',
    product,
  };
}

export function addProduct(uuid, product) {
  return {
    type: '@cart/ADD_PRODUCT',
    uuid,
    product,
  };
}

export function addToOrder(uuid, data, operator) {
  return {
    type: '@cart/ADD_ORDER_SUCCESS',
    uuid,
    data,
    operator,
  };
}

export function removeFromCart(uuid) {
  return {
    type: '@cart/REMOVE',
    uuid,
  };
}
