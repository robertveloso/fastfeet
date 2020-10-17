import produce, { original } from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
    case '@cart/ADD_PRODUCT':
      return produce(state, draft => {
        const { uuid, product } = action;
        const productIndex = draft.findIndex(p => p.uuid === uuid);
        draft[productIndex].orders.push(product);
      });

    case '@cart/ADD_SUCCESS':
      return produce(state, draft => {
        const { product } = action;

        draft.push(product);
      });
    case '@cart/REMOVE':
      return produce(state, draft => {
        const productIndex = draft[0].orders.findIndex(
          p => p.uuid === action.uuid
        );
        if (productIndex >= 0) {
          draft[0].orders.splice(productIndex, 1);
        }
      });
    case '@cart/UPDATE_QUANTITY_SUCCESS': {
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.productId);
        const stockIndex = draft[productIndex].stock.findIndex(
          s => s.id === action.stockId
        );
        if (stockIndex >= 0) {
          draft[productIndex].stock[stockIndex].quantity = action.quantity;
        }
      });
    }
    case '@cart/ADD_ORDER_SUCCESS':
      return produce(state, draft => {
        const clone = original(draft);
        const productIndex = clone.findIndex(p => p.uuid === action.uuid);
        const orderIndex = clone[productIndex].orders.findIndex(
          o => o.uuid === action.data.uuid
        );
        if (orderIndex >= 0) {
          const stockIndex = clone[productIndex].orders[
            orderIndex
          ].stock.findIndex(s => s.id === action.data.stock[0].id);
          if (stockIndex >= 0) {
            if (
              draft[productIndex].orders[orderIndex].stock[stockIndex]
                .quantity === 1 &&
              action.operator === -1
            ) {
              draft[productIndex].orders[orderIndex].stock.splice(
                stockIndex,
                1
              );
              return;
            }
            draft[productIndex].orders[orderIndex].stock[stockIndex].quantity +=
              action.operator;
          } else {
            draft[productIndex].orders[orderIndex].stock.push(
              action.data.stock[0]
            );
          }
        } else if (productIndex >= 0) {
          draft[productIndex].orders.push(action.data);
        }
      });

    case '@cart/INIT_SUCCESS':
      return [...state, action.data];
    case '@cart/CLEAR':
      return [];
    default:
      return state;
  }
}
