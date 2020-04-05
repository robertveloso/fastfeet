import React from 'react';

import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

import PropTypes from 'prop-types';

import { Next, Previous } from './styles';

export default function NavigateButton({ title, action, background, ...rest }) {
  return title === 'proximo' ? (
    <Next onClick={action} background={background} {...rest}>
      {title}
      <MdNavigateNext color="#fff" size={16} />
    </Next>
  ) : (
    <Previous onClick={action} background={background} {...rest}>
      <MdNavigateBefore color="#fff" size={16} />
      {title}
    </Previous>
  );
}

NavigateButton.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  background: PropTypes.string,
};

NavigateButton.defaultProps = {
  background: '',
};
