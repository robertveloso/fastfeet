import React, { useRef, useEffect } from 'react';
import Select from 'react-select';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

import { Container, Label, Error } from './styles';

export default function SelectInput({ name, label, ...rest }) {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      // path: 'select.state.value',
      getValue: ref => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map(option => option.value);
        }
        if (!ref.state.value) {
          return '';
        }
        return ref.state.value.value;
      },
      clearValue(ref) {
        ref.select.clearValue();
      },
      setValue(ref, value) {
        ref.select.setValue(value);
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <Container>
      {label && <Label htmlFor={fieldName}>{label}</Label>}
      <Select
        cacheOptions
        defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="react-select"
        {...rest}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
}

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

SelectInput.defaultProps = {
  label: '',
};
