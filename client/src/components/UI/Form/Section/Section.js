import React from 'react';
import classNames from 'classnames';
import './Section.scss';

const FormSection = ({ children, className }) => {
  const inputClass = classNames('form__section', className);

  return (
    <div className={inputClass}>
      {children}
    </div>
  );
};

export default FormSection;