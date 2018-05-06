import React from 'react';
import classNames from 'classnames';
import './Bar.scss';

const MenuBar = ({ children, className, expand }) => {
  const inputClass = classNames('menu__bar', {
    'menu__bar--expand': expand
  }, className);

  return (
    <div className={inputClass}>
      {children}
    </div>
  );
};

export default MenuBar;