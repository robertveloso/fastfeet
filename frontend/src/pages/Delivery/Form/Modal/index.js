import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdAdd, MdRemove, MdArrowForward, MdDelete } from 'react-icons/md';

import { Wizard, Steps, Step } from 'react-albus';
import { v4 as uuidv4 } from 'uuid';

import api from '~/services/api';

import Modal from '~/components/ModalStyled';

import { Container } from './styles';

import * as CartActions from '~/store/modules/cart/actions';

export default function DeliveryModal({ uuid }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(0);
  const [stock, setStock] = useState();
  const [products, setProducts] = useState([]);

  const uuidOrderTmp = uuidv4();
  const [uuidOrder, setUUID] = useState(uuidOrderTmp);
  const quantity = useSelector(state =>
    state.cart.reduce((sumQuantity, product) => {
      sumQuantity[uuidOrder] = product.orders.find(
        o => o.uuid === uuidOrder
      )?.stock;
      return sumQuantity;
    }, {})
  );

  const cart = useSelector(state =>
    state.cart.map(order => {
      return order;
    }, {})
  );

  useEffect(() => {
    async function productsOptions() {
      const response = await api.get('/products');
      setProducts(response.data);
    }
    async function stockOptions() {
      const response = await api.get('/stock');
      setStock(response.data);
    }
    stockOptions();
    productsOptions();
  }, []);

  function handleUpdateQuantity(product, stock, operator) {
    dispatch(CartActions.updateQuantityRequest(uuid, product, stock, operator));
  }

  function addProduct(e, product) {
    e.preventDefault();
    dispatch(CartActions.addProduct(uuid, product));
    setUUID(uuidv4());
  }

  function handleDelete(e, uuid) {
    e.preventDefault();
    dispatch(CartActions.removeFromCart(uuid));
  }

  return (
    <Modal text="ADICIONAR PRODUTOS" icon={<MdAdd size={24} />}>
      <Container>
        <Wizard>
          <Steps>
            <Step
              id="merlin"
              render={({ next, push }) => {
                return (
                  <>
                    <small>Pedido</small>
                    {products?.map(product => (
                      <section id={product?.id} key={product?.id}>
                        <small>
                          {product?.name}{' '}
                          <button
                            onClick={() => {
                              setSelected({
                                uuidOrder,
                                id: product?.id,
                                name: product?.name,
                                price: product?.price,
                              });
                              next();
                            }}
                          >
                            <MdArrowForward />
                          </button>
                          <button
                            onClick={e => {
                              addProduct(e, {
                                uuid: uuidOrder,
                                id: product?.id,
                                name: product?.name,
                                price: product?.price,
                                stock: [],
                              });
                            }}
                          >
                            <MdAdd />
                          </button>
                        </small>
                        {cart[0] &&
                          cart[0].orders?.flatMap(
                            order =>
                              order.id === product.id && (
                                <div id={order?.uuid} key={order?.uuid}>
                                  <small>
                                    {order?.name}{' '}
                                    <button
                                      onClick={e => {
                                        e.preventDefault();
                                        setSelected({
                                          uuidOrder: order?.uuid,
                                          id: order?.id,
                                          name: order?.name,
                                          price: product?.price,
                                        });
                                        push('luigi');
                                      }}
                                    >
                                      <MdArrowForward />
                                    </button>
                                    <button
                                      onClick={e => {
                                        handleDelete(e, order?.uuid);
                                      }}
                                    >
                                      <MdDelete />
                                    </button>
                                  </small>
                                </div>
                              )
                          )}
                      </section>
                    ))}
                  </>
                );
              }}
            />
            <Step
              id="gandalf"
              render={({ previous }) => {
                return (
                  <>
                    <button
                      onClick={() => {
                        setUUID(uuidv4());
                        previous();
                      }}
                    >
                      {'<'} Voltar
                    </button>
                    {stock?.map(stockItem => (
                      <div id={stockItem?.id} key={stockItem?.id}>
                        <small>{stockItem?.name}</small>
                        <div>
                          <MdAdd
                            onClick={() =>
                              handleUpdateQuantity(
                                selected,
                                {
                                  id: stockItem?.id,
                                  name: stockItem?.name,
                                  price: stockItem?.price,
                                },
                                +1
                              )
                            }
                          />
                          <input
                            type="text"
                            value={
                              (quantity[uuidOrder] &&
                                quantity[uuidOrder].find(
                                  o => o.id === stockItem?.id
                                )?.quantity) ||
                              0
                            }
                            readOnly
                          />
                          <MdRemove
                            onClick={() =>
                              handleUpdateQuantity(
                                selected,
                                {
                                  id: stockItem?.id,
                                  name: stockItem?.name,
                                  price: stockItem?.price,
                                },
                                -1
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </>
                );
              }}
            />
            <Step
              id="luigi"
              render={({ previous }) => {
                return (
                  <>
                    <button onClick={previous}>{'<'} Voltar</button>
                    {stock?.map(stockItem => (
                      <div id={stockItem?.id} key={stockItem?.id}>
                        <small>{stockItem?.name}</small>
                        <div>
                          <MdAdd
                            onClick={() =>
                              handleUpdateQuantity(
                                selected,
                                {
                                  id: stockItem?.id,
                                  name: stockItem?.name,
                                  price: stockItem?.price,
                                },
                                +1
                              )
                            }
                          />

                          {cart[0].orders
                            .find(order => order.uuid === selected.uuidOrder)
                            ?.stock.filter(s => s.id === stockItem.id)
                            ?.map((item, i) => (
                              <input
                                type="text"
                                value={item?.quantity || 0}
                                readOnly
                                key={i}
                              />
                            ))}

                          <MdRemove
                            onClick={() =>
                              handleUpdateQuantity(
                                selected,
                                {
                                  id: stockItem?.id,
                                  name: stockItem?.name,
                                  price: stockItem?.price,
                                },
                                -1
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </>
                );
              }}
            />
          </Steps>
        </Wizard>
      </Container>
    </Modal>
  );
}
