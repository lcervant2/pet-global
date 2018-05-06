import React from 'react';
import classNames from 'classnames';
import './Button.scss';

import Icon from '../Icon/Icon';

const Button = ({ children, className, type, primary, secondary, danger, icon, block, loading, large, onClick }) => {
  const inputClass = classNames(
    'button',
    {
      'button--primary': primary,
      'button--secondary': secondary,
      'button--danger': danger,
      'button--icon-only': icon && !children,
      'button--block': block,
      'button--loading': loading,
      'button--large': large
    },
    className);

  const buttonType = type || 'button';

  return (
    <button className={inputClass} type={buttonType} onClick={onClick}>
      {loading ? (
        <i className='fa fa-circle-notch fa-spin'></i>
      ) : (
        <div>
          {icon && <Icon name={icon} />}
          {icon && children && <span>&nbsp;&nbsp;</span>}
          {children}
        </div>
      )}
    </button>
  );
};

export default Button;