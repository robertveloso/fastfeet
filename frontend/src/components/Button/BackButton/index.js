import React from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import history from '~/services/history';

import IconButton from '../IconButton';

export default function BackButton({ action, text }) {
  return (
    <IconButton
      title={text ? text : 'VOLTAR'}
      Icon={MdKeyboardArrowLeft}
      action={action ? action : history.goBack}
      background="#CCC"
    />
  );
}
