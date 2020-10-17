import React, { useRef, useEffect } from 'react';

import { useField } from '@unform/core';

import { CurrencyMask, Label, Error } from './styles';

export default function CurrencyInput({ name, label, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref, value) {
        ref.state.value = value;
      },
      clearValue(ref) {
        ref.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <Label htmlFor={fieldName}>
      <strong>{label}</strong>
      <CurrencyMask
        ref={inputRef}
        defaultValue={defaultValue}
        separator=","
        {...rest}
      />
      {error && <Error>{error}</Error>}
    </Label>
  );
}
