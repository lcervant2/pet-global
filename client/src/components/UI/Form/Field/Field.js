import React from 'react';
import classNames from 'classnames';
import './Field.scss';

const FormField = ({ children, className }) => {
  const inputClass = classNames('form__field', className);

  return (
    <div className={inputClass}>
      {children}
    </div>
  );
};

export default FormField;