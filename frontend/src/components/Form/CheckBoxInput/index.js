import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

const CheckboxInput = ({ name, option, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      getValue: ref => {
        return ref.checked;
      },
      clearValue: ref => {
        ref.checked = false;
      },
      setValue: (ref, values) => {
        ref.checked = values;
      },
    });
  }, [fieldName, registerField]);

  return (
    <div>
      <label htmlFor={option.id} key={option.id}>
        <input
          defaultChecked={defaultValue}
          ref={inputRef}
          value={option.value}
          type="checkbox"
          id={option.id}
          {...rest}
        />
        {option.label}
      </label>
    </div>
  );
};

export default CheckboxInput;
