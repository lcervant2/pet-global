import React from 'react';
import classNames from 'classnames';
import './ClearFloat.scss';

const ClearFloat = ({ className }) => {
  const inputClass = classNames('clear-float', className);

  return (
    <div className={inputClass}></div>
  );
};

export default ClearFloat;