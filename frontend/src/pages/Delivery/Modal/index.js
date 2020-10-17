import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MdPrint } from 'react-icons/md';

import Modal from '~/components/Modal';
import { initCart } from '~/store/modules/cart/actions';
import { formatPriceDisplay } from '~/utils/format';

import { Container, Print, Button } from './styles';

export default function DeliveryModal({ data }) {
  let ref = useRef(null);
  const dispatch = useDispatch();
  const cart = useSelector(state =>
    state.cart.map(order => {
      return order;
    }, {})
  );

  useEffect(() => {
    data?.id && dispatch(initCart(data?.id));
    return;
  }, [dispatch, data]);

  const styleOverrides = `
    @media all {
      .page-break {
        display: none;
      }
    }
    
    @media print {
      html, body {
        height: initial !important;
        overflow: initial !important;
        -webkit-print-color-adjust: exact;
      }
    }
    
    @media print {
      p {
        display: flex !important;
      }
      .page-break {
        margin-top: 1rem;
        display: block;
        page-break-before: auto;
      }
    }
    
    @page {
      size: auto;
      margin: 20mm;
    }
  `;

  return (
    <Modal>
      <Print
        trigger={() => (
          <Button>
            <MdPrint color="#fff" size={16} />
            IMPRIMIR
          </Button>
        )}
        content={() => ref}
        documentTitle="Acai Food - Pedido"
        pageStyle={styleOverrides}
      />
      <Container ref={el => (ref = el)}>
        <p>
          <small>NÃO É DOCUMENTO FISCAL</small>
          <small>COMPROVANTE NÃO-FISCAL</small>
        </p>
        <strong>Pedido #{String(data?.code).padStart(7, '0')}</strong>
        {cart[0] &&
          cart[0].orders?.map((order, i) => (
            <div key={i}>
              <small>
                {order?.name} - {formatPriceDisplay(order?.price)}
              </small>
              <ul>
                {order?.stock.map((stock, k) => (
                  <li key={k}>
                    <small>
                      {stock.name} - {formatPriceDisplay(stock.price)}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        {data?.payment_method !== null && (
          <div>
            <strong>
              Pagamento - {data?.payment_method === 0 ? 'Cartão' : 'Dinheiro'}
            </strong>
            <small>
              {data?.fare > 0 && `Frete: ${formatPriceDisplay(data?.fare)}`}
            </small>
            <small>
              {data?.discount > 0 &&
                `Desconto: ${formatPriceDisplay(data?.discount)}`}
            </small>
            <small>
              {data?.received > 0 &&
                `Recebido: ${formatPriceDisplay(data?.received)}`}
            </small>
            <small>
              {data?.change && `Troco: ${formatPriceDisplay(data?.change)}`}
            </small>

            <small>Total: {formatPriceDisplay(data?.total)}</small>
          </div>
        )}
        {data?.recipient.id && (
          <div>
            <strong>Dados do cliente</strong>
            <small>
              {data?.recipient?.name}
              {data?.recipient?.name && <br />}
              {data?.recipient?.phone}
            </small>
            {data?.recipient?.street && <strong>Endereço</strong>}
            <small>
              {data?.recipient?.street}
              {data?.recipient?.number && `, ${data?.recipient?.number}`}
            </small>
            <small>
              {data?.recipient?.district}
              {data?.recipient?.complement &&
                `, ${data?.recipient?.complement}`}
            </small>
          </div>
        )}
        {data?.start_dateFormated ? (
          <div>
            <strong>Datas</strong>
            <div>
              <span>Retirada: </span>
              <small>{data?.start_dateFormated}</small>
            </div>
            {data?.end_dateFormated ? (
              <div>
                <span>Entrega: </span>
                <small>{data?.end_dateFormated}</small>
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </Modal>
  );
}

DeliveryModal.propTypes = {
  data: PropTypes.shape({
    start_dateFormated: PropTypes.string,
    end_dateFormated: PropTypes.string,
    recipient: PropTypes.shape({
      name: PropTypes.string,
      street: PropTypes.string,
      number: PropTypes.number,
      city: PropTypes.string,
      state: PropTypes.string,
      zip_code: PropTypes.string,
    }),
    status: PropTypes.string,
    signature: PropTypes.shape({
      url: PropTypes.string,
    }),
  }).isRequired,
};
