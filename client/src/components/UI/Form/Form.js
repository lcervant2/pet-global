import React from 'react';
import classNames from 'classnames';
import './Form.scss';

const Form = ({ children, className, onSubmit }) => {
  const inputClass = classNames('form', className);

  return (
    <form className={inputClass} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;