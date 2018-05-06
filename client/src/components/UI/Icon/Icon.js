import React from 'react';
import classNames from 'classnames';
import './Icon.scss';

const Icon = ({ name, className, ...rest }) => {
  const inputClass = classNames('icon', className);

  return (
    <div className={inputClass} {...rest}>
      <i className={'fas fa-' + name} ></i>
    </div>
  );
};

export default Icon;