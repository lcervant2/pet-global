import React from 'react';
import classNames from 'classnames';
import './Group.scss';

const FormGroup = ({ children, className }) => {
  const inputClass = classNames('form__group', className);

  return (
    <div className={inputClass}>
      {children}
    </div>
  );
};

export default FormGroup;