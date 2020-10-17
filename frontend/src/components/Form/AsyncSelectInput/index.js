import React, { useRef, useEffect } from 'react';

import Select from 'react-select/async';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

// import { Container, Label, Error } from './styles';
import { Container, Label } from './styles';

export default function AsyncSelectInput({ name, label, ...rest }) {
  const tooltipRef = useRef(null);
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'select.state.value',
      getValue: ref => {
        if (rest.isMulti) {
          if (!ref.select.state.value) {
            return [];
          }
          return ref.select.state.value.map(option => option.value);
        }
        if (!ref.select.state.value) {
          return '';
        }
        return ref.select.state.value.value;
      },
      clearValue(ref) {
        ref.select.select.clearValue();
      },
      setValue(ref, value) {
        ref.select.select.setValue(value);
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  useEffect(() => {
    error && ReactTooltip.show(tooltipRef.current);
  }, [error]);

  return (
    <Container>
      {label && <Label htmlFor={fieldName}>{label}</Label>}

      <div data-tip data-for={name} ref={tooltipRef}>
        <Select
          cacheOptions
          defaultValue={defaultValue}
          ref={selectRef}
          name={name}
          classNamePrefix="react-select"
          data-tip
          data-for={name}
          {...rest}
        />
      </div>
      {error && (
        <>
          <ReactTooltip id={name} type="error" effect="solid">
            <span>{error}</span>
          </ReactTooltip>
        </>
      )}
    </Container>
  );
}

AsyncSelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

AsyncSelectInput.defaultProps = {
  label: '',
};
