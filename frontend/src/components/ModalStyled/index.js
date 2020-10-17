import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { useHotkeys } from 'react-hotkeys-hook';

import PropTypes from 'prop-types';

import { Container } from './styles';

export default function Modal({ children, text, icon }) {
  const [open, setOpen] = useState(false);
  useHotkeys('alt+4', () => setOpen(true));

  return (
    <Popup
      open={open}
      onClose={() => setOpen(false)}
      trigger={
        <Container>
          {icon}
          {text}
        </Container>
      }
      modal
      position="center center"
      contentStyle={{
        width: '450px',
        borderRadius: '4px',
        padding: '25px 25px 0px 25px',
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
  children: PropTypes.element.isRequired,
};
