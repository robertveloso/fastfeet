import React from 'react';
import Popup from 'reactjs-popup';
import { Portal } from 'react-portal';
import { useHotkeys } from 'react-hotkeys-hook';

import Recipients from './Form';

export default function ModalClient({ setOpen, open }) {
  useHotkeys('alt+3', () => setOpen(true));
  return (
    <Portal>
      <Popup
        onClose={() => setOpen(false)}
        open={open}
        modal
        position="center center"
        contentStyle={{
          width: '900px',
          borderRadius: '4px',
          padding: '25px 25px 0px 25px',
        }}
        overlayStyle={{
          background: 'rgb(0, 0, 0, 0.7)',
          border: 'rgb(0, 0, 0, 0.7)',
        }}
      >
        {close => <Recipients close={close} />}
      </Popup>
    </Portal>
  );
}
