import React from 'react';
import { MdPrint } from 'react-icons/md';
import Popup from 'reactjs-popup';

import PropTypes from 'prop-types';

export default function Modal({ children }) {
  return (
    <Popup
      trigger={
        <button type="button">
          <MdPrint color="#8E5BE8" size={15} />
          <span>Imprimir</span>
        </button>
      }
      modal
      position="center center"
      contentStyle={{
        width: '450px',
        borderRadius: '4px',
        padding: '25px 25px 0px 25px',
        overflow: 'auto',
        height: '402px',
      }}
      overlayStyle={{
        background: 'rgb(0, 0, 0, 0.7)',
        border: 'rgb(0, 0, 0, 0.7)',
      }}
    >
      {children}
    </Popup>
  );
}

Modal.propTypes = {
  children: PropTypes.array.isRequired,
  // children: PropTypes.element.isRequired,
};
